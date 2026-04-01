import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Offer, Property, TransactionModel } from "@/lib/models";
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

const idSchema = z.string().min(1);

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
      return badRequest("Only pending offers can be accepted");
    }

    const updated = await Offer.findByIdAndUpdate(
      parsedId.data,
      { status: "accepted" },
      { new: true },
    ).lean<IOfferLean | null>();

    await TransactionModel.create({
      property_id: offer.property_id,
      buyer_id: offer.buyer_id,
      agent_id: property.agent_id,
      offer_id: String(offer._id),
      sale_price: Number(offer.amount),
      commission_rate: 0.03,
      status: "pending",
    });

    await Property.findByIdAndUpdate(offer.property_id, {
      status: "pending",
    });

    await triggerNotification({
      userId: offer.buyer_id,
      type: "offer_accepted",
      title: "Offer accepted!",
      body: `Your offer for ${property.title} has been accepted.`,
      relatedId: String(updated!._id),
    });

    return ok({ message: "Offer accepted", offer: updated });
  } catch (err) {
    console.error("[offers/[id]/accept] POST", err);
    return serverError();
  }
}
