import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Offer, Property } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
  unprocessable,
} from "@/lib/response";
import { IOfferLean, IPropertyLean } from "@/types";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().min(1);
const statusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "countered",
  "withdrawn",
]);

const putSchema = z.object({
  status: statusSchema,
});

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const offer = await Offer.findOne({
      _id: parsedId.data,
      deleted_at: null,
    }).lean<IOfferLean | null>();

    if (!offer) return notFound("Offer not found");

    const property = await Property.findById(offer.property_id)
      .select("agent_id title city state")
      .lean<IPropertyLean | null>();

    if (session.user.role !== "admin") {
      const allowed =
        (session.user.role === "agent" &&
          property?.agent_id === session.user.id) ||
        (session.user.role === "client" && offer.buyer_id === session.user.id);
      if (!allowed) return forbidden("Forbidden");
    }

    return ok({
      ...offer,
      id: String(offer._id),
      property: property
        ? {
            id: String(property._id),
            agent_id: property.agent_id,
            title: property.title,
            city: property.city,
            state: property.state,
          }
        : null,
    });
  } catch (err) {
    console.error("[offers/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    const offer = await Offer.findOne({
      _id: parsedId.data,
      deleted_at: null,
    }).lean<IOfferLean | null>();

    if (!offer) return notFound("Offer not found");

    const property = await Property.findById(offer.property_id)
      .select("agent_id")
      .lean<IPropertyLean | null>();

    if (
      session.user.role !== "admin" &&
      property?.agent_id !== session.user.id
    ) {
      return forbidden("Forbidden");
    }

    const updated = await Offer.findByIdAndUpdate(
      parsedId.data,
      { status: body.status },
      { new: true },
    ).lean<IOfferLean | null>();

    if (!updated) return serverError();

    if (body.status === "accepted") {
      await triggerNotification({
        userId: offer.buyer_id,
        type: "offer_accepted",
        title: "Offer accepted",
        body: "Your offer has been accepted.",
        relatedId: String(updated._id),
      });
    }
    if (body.status === "rejected") {
      await triggerNotification({
        userId: offer.buyer_id,
        type: "offer_rejected",
        title: "Offer rejected",
        body: "Your offer has been rejected.",
        relatedId: String(updated._id),
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
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const offer = await Offer.findOne({
      _id: parsedId.data,
      deleted_at: null,
    })
      .select("buyer_id status")
      .lean<IOfferLean | null>();

    if (!offer) return notFound("Offer not found");

    if (session.user.role !== "admin" && offer.buyer_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    if (offer.status !== "pending") {
      return unprocessable("Only pending offers can be withdrawn");
    }

    await Offer.findByIdAndUpdate(parsedId.data, {
      deleted_at: new Date(),
    });

    return ok({ message: "Offer withdrawn" });
  } catch (err) {
    console.error("[offers/[id]] DELETE", err);
    return serverError();
  }
}
