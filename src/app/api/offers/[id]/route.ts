import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, badRequest, forbidden, serverError, notFound, unprocessable } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().uuid();
const statusSchema = z.enum(["pending", "accepted", "rejected", "countered", "withdrawn"]);

const putSchema = z.object({
  status: statusSchema,
});

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const offer = await prisma.offer.findUnique({
      where: { id: parsedId.data, deleted_at: null } as any,
      include: {
        property: {
          select: { id: true, agent_id: true, title: true, city: true, state: true },
        },
      },
    });

    if (!offer) return notFound("Offer not found");

    if (session.user.role !== "admin") {
      const allowed =
        (session.user.role === "agent" && offer.property.agent_id === session.user.id) ||
        (session.user.role === "client" && offer.buyer_id === session.user.id);
      if (!allowed) return forbidden("Forbidden");
    }

    return ok(offer);
  } catch (err) {
    console.error("[offers/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    const offer = await prisma.offer.findUnique({
      where: { id: parsedId.data, deleted_at: null } as any,
      include: {
        property: { select: { id: true, agent_id: true } },
      },
    });

    if (!offer) return notFound("Offer not found");

    if (session.user.role !== "admin" && offer.property.agent_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const updated = await prisma.offer.update({
      where: { id: parsedId.data },
      data: { status: body.status },
    });

    if (body.status === "accepted") {
      await triggerNotification({
        userId: offer.buyer_id,
        type: "offer_accepted",
        title: "Offer accepted",
        body: "Your offer has been accepted.",
        relatedId: updated.id,
      });
    }
    if (body.status === "rejected") {
      await triggerNotification({
        userId: offer.buyer_id,
        type: "offer_rejected",
        title: "Offer rejected",
        body: "Your offer has been rejected.",
        relatedId: updated.id,
      });
    }

    return ok(updated);
  } catch (err) {
    console.error("[offers/[id]] PUT", err);
    return serverError();
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const offer = await prisma.offer.findUnique({
      where: { id: parsedId.data, deleted_at: null } as any,
      select: { id: true, buyer_id: true, status: true },
    });

    if (!offer) return notFound("Offer not found");

    if (session.user.role !== "admin" && offer.buyer_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    if (offer.status !== "pending") {
      return unprocessable("Only pending offers can be withdrawn");
    }

    await prisma.offer.update({
      where: { id: parsedId.data },
      data: { deleted_at: new Date() },
    });

    return ok({ message: "Offer withdrawn" });
  } catch (err) {
    console.error("[offers/[id]] DELETE", err);
    return serverError();
  }
}

