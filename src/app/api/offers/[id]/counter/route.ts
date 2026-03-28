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
import { parseBody } from "@/lib/validator";

const idSchema = z.string().uuid();
const counterSchema = z.object({
  counter_amount: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive()),
  message: z.string().max(1000).optional(),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, counterSchema);
    if (body instanceof Response) return body;

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
      return badRequest("Only pending offers can be countered");
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: parsedId.data },
      data: {
        status: "countered",
        message:
          body.message ||
          `Counter-offer: $${body.counter_amount.toLocaleString()}`,
      },
    });

    const counterOffer = await prisma.offer.create({
      data: {
        property_id: offer.property_id,
        buyer_id: offer.property.agent_id,
        amount: body.counter_amount,
        message: `Counter-offer to original offer of $${Number(offer.amount).toLocaleString()}`,
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "pending",
      },
    });

    await triggerNotification({
      userId: offer.buyer_id,
      type: "offer_received",
      title: "Counter-offer received",
      body: `You received a counter-offer of $${body.counter_amount.toLocaleString()} for ${offer.property.title}.`,
      relatedId: counterOffer.id,
    });

    return ok({
      message: "Counter-offer created",
      original_offer: updatedOffer,
      counter_offer: counterOffer,
    });
  } catch (err) {
    console.error("[offers/[id]/counter] POST", err);
    return serverError();
  }
}
