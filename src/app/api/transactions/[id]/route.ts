import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, badRequest, forbidden, serverError, notFound } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";
import { toNumberOrNull } from "@/lib/serialization";

const idSchema = z.string().uuid();

const putSchema = z.object({
  status: z.enum(["pending", "in_escrow", "closed", "cancelled"]).optional(),
  closing_date: z.string().datetime().optional().nullable(),
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

    const tx = await prisma.transaction.findUnique({
      where: { id: parsedId.data },
      include: {
        property: { select: { id: true, title: true, status: true } },
        buyer: { select: { id: true, email: true, name: true } },
        agent: { select: { id: true, email: true, name: true } },
      },
    });

    if (!tx) return notFound("Transaction not found");

    if (session.user.role !== "admin") {
      const allowed =
        (session.user.role === "agent" && tx.agent_id === session.user.id) ||
        (session.user.role === "client" && tx.buyer_id === session.user.id);
      if (!allowed) return forbidden("Forbidden");
    }

    return ok({
      ...tx,
      sale_price: toNumberOrNull(tx.sale_price) ?? 0,
      commission_rate: toNumberOrNull(tx.commission_rate) ?? 0,
    });
  } catch (err) {
    console.error("[transactions/[id]] GET", err);
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

    const tx = await prisma.transaction.findUnique({
      where: { id: parsedId.data },
      select: { id: true, property_id: true, buyer_id: true, agent_id: true, status: true },
    });

    if (!tx) return notFound("Transaction not found");

    if (session.user.role !== "admin" && tx.agent_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const nextStatus = body.status ?? tx.status;
    const nextClosingDate = body.closing_date !== undefined
      ? (body.closing_date === null ? null : new Date(body.closing_date))
      : undefined;

    const updated = await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(nextClosingDate !== undefined ? { closing_date: nextClosingDate } : {}),
      },
      include: {
        property: { select: { id: true, status: true } },
      },
    });

    if (nextStatus === "closed") {
      await prisma.property.update({
        where: { id: tx.property_id },
        data: { status: "sold" },
      });

      await triggerNotification({
        userId: tx.buyer_id,
        type: "transaction_closed",
        title: "Transaction closed",
        body: "The transaction has been marked as closed.",
        relatedId: tx.id,
      });
    }

    return ok(updated);
  } catch (err) {
    console.error("[transactions/[id]] PUT", err);
    return serverError();
  }
}

