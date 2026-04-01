import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Offer, Property, PropertyImage } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, created, badRequest, serverError, notFound } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";
import { toNumberOrNull } from "@/lib/serialization";
import { IOfferLean, IPropertyLean, IPropertyImageLean } from "@/types";

const createSchema = z.object({
  property_id: z.string().min(1),
  amount: z.coerce.number().positive(),
  message: z.string().max(2000).optional().nullable(),
  expiry_date: z.string().datetime(),
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

function pagination(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  };
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const expiryDate = new Date(parsed.data.expiry_date);
    if (expiryDate.getTime() < Date.now()) {
      return badRequest("expiry_date cannot be in the past");
    }

    const property = await Property.findOne({
      _id: parsed.data.property_id,
      deleted_at: null,
    })
      .select("agent_id")
      .lean<IPropertyLean | null>();
    if (!property) return notFound("Property not found");

    const offer = await Offer.create({
      property_id: parsed.data.property_id,
      buyer_id: session.user.id,
      amount: parsed.data.amount,
      message: parsed.data.message ?? undefined,
      expiry_date: expiryDate,
      status: "pending",
    });

    await triggerNotification({
      userId: property.agent_id,
      type: "offer_received",
      title: "New offer received",
      body: `Offer submitted: $${toNumberOrNull(offer.amount as unknown) ?? Number(offer.amount) ?? 0}`,
      relatedId: String(offer._id),
    });

    return created(offer.toJSON());
  } catch (err) {
    console.error("[offers] POST", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const url = new URL(req.url);
    const q = parseQuery(url.searchParams, querySchema);
    if (q instanceof Response) return q;

    const page = q.page ?? 1;
    const limit = q.limit ?? 20;

    let filter: Record<string, unknown> = { deleted_at: null };
    if (session.user.role === "admin") {
    } else if (session.user.role === "agent") {
      const props = await Property.find({
        agent_id: session.user.id,
        deleted_at: null,
      })
        .select("_id")
        .lean<IPropertyLean[]>();
      const propertyIds = props.map((p) => String(p._id));
      filter = { ...filter, property_id: { $in: propertyIds } };
    } else {
      filter = { ...filter, buyer_id: session.user.id };
    }

    const [total, offers] = await Promise.all([
      Offer.countDocuments(filter),
      Offer.find(filter)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IOfferLean[]>(),
    ]);

    const propIds = [...new Set(offers.map((o) => o.property_id))];
    const properties = await Property.find({ _id: { $in: propIds } })
      .select("title city state")
      .lean<IPropertyLean[]>();
    const propMap = new Map(properties.map((p) => [String(p._id), p]));

    const primaryUrls = await PropertyImage.find({
      property_id: { $in: propIds },
      is_primary: true,
    }).lean<IPropertyImageLean[]>();
    const imgMap = new Map(primaryUrls.map((i) => [i.property_id, i.url]));

    const data = offers.map((o) => {
      const p = propMap.get(o.property_id);
      return {
        ...o,
        id: String(o._id),
        amount: toNumberOrNull(o.amount as unknown) ?? Number(o.amount) ?? 0,
        primary_image_url: imgMap.get(o.property_id) ?? null,
        property: p
          ? {
              id: o.property_id,
              title: p.title,
              city: p.city,
              state: p.state,
              images: [{ url: imgMap.get(o.property_id) }],
            }
          : null,
      };
    });

    return ok({
      data,
      pagination: pagination(total, page, limit),
    });
  } catch (err) {
    console.error("[offers] GET", err);
    return serverError();
  }
}
