import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().uuid();

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const offer = await prisma.offer.findUnique({
      where: { id: parsedId.data, deleted_at: null } as any,
      include: {
        property: { select: { id: true, agent_id: true, title: true } },
      },
    });

    if (!offer) return notFound("Offer not found");
    if (
      session.user.role !== "admin" &&
      offer.property.agent_id !== session.user.id
    ) {
      return forbidden("Forbidden");
    }
    if (offer.status !== "pending") {
      return badRequest("Only pending offers can be rejected");
    }

    const updated = await prisma.offer.update({
      where: { id: parsedId.data },
      data: { status: "rejected" },
    });

    await triggerNotification({
      userId: offer.buyer_id,
      type: "offer_rejected",
      title: "Offer rejected",
      body: `Your offer for ${offer.property.title} has been rejected.`,
      relatedId: updated.id,
    });

    return ok({ message: "Offer rejected", offer: updated });
  } catch (err) {
    console.error("[offers/[id]/reject] POST", err);
    return serverError();
  }
}
