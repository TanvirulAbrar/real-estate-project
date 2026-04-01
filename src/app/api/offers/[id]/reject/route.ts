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
      return badRequest("Only pending offers can be rejected");
    }

    const updated = await Offer.findByIdAndUpdate(
      parsedId.data,
      { status: "rejected" },
      { new: true },
    ).lean<IOfferLean | null>();

    await triggerNotification({
      userId: offer.buyer_id,
      type: "offer_rejected",
      title: "Offer rejected",
      body: `Your offer for ${property.title} has been rejected.`,
      relatedId: String(updated!._id),
    });

    return ok({ message: "Offer rejected", offer: updated });
  } catch (err) {
    console.error("[offers/[id]/reject] POST", err);
    return serverError();
  }
}
