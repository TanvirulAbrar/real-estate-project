import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Offer, Property } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { IOfferLean, IPropertyLean } from "@/types";
import { triggerNotification } from "@/lib/notify";
import { parseBody } from "@/lib/validator";

const idSchema = z.string().min(1);
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
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, counterSchema);
    if (body instanceof Response) return body;

    const offer = await Offer.findOne({
      _id: parsedId.data,
      deleted_at: null,
    }).lean<IOfferLean | null>();

    if (!offer) return notFound("Offer not found");

    const property = await Property.findById(offer.property_id)
      .select("agent_id title")
      .lean<IPropertyLean | null>();

    if (!property) return notFound("Property not found");

    if (
      session.user.role !== "admin" &&
      property.agent_id !== session.user.id
    ) {
      return forbidden("Forbidden");
    }
    if (offer.status !== "pending") {
      return badRequest("Only pending offers can be countered");
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      parsedId.data,
      {
        status: "countered",
        message:
          body.message ||
          `Counter-offer: $${body.counter_amount.toLocaleString()}`,
      },
      { new: true },
    ).lean<IOfferLean | null>();

    const counterOffer = await Offer.create({
      property_id: offer.property_id,
      buyer_id: property.agent_id,
      amount: body.counter_amount,
      message: `Counter-offer to original offer of $${Number(offer.amount).toLocaleString()}`,
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
    });

    await triggerNotification({
      userId: offer.buyer_id,
      type: "offer_received",
      title: "Counter-offer received",
      body: `You received a counter-offer of $${body.counter_amount.toLocaleString()} for ${property.title}.`,
      relatedId: String(counterOffer._id),
    });

    return ok({
      message: "Counter-offer created",
      original_offer: updatedOffer,
      counter_offer: counterOffer.toJSON(),
    });
  } catch (err) {
    console.error("[offers/[id]/counter] POST", err);
    return serverError();
  }
}
