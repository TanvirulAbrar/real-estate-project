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
      return badRequest("Only pending offers can be accepted");
    }

    const updated = await prisma.offer.update({
      where: { id: parsedId.data },
      data: { status: "accepted" },
    });

    await prisma.transaction.create({
      data: {
        property_id: offer.property_id,
        buyer_id: offer.buyer_id,
        agent_id: offer.property.agent_id,
        offer_id: offer.id,
        sale_price: offer.amount,
        commission_rate: 0.03,
        status: "pending",
      },
    });

    await prisma.property.update({
      where: { id: offer.property_id },
      data: { status: "pending" },
    });

    await triggerNotification({
      userId: offer.buyer_id,
      type: "offer_accepted",
      title: "Offer accepted!",
      body: `Your offer for ${offer.property.title} has been accepted.`,
      relatedId: updated.id,
    });

    return ok({ message: "Offer accepted", offer: updated });
  } catch (err) {
    console.error("[offers/[id]/accept] POST", err);
    return serverError();
  }
}
