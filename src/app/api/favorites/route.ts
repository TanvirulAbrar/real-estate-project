import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property, PropertyImage, Favorite, Review } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  conflict,
  serverError,
  notFound,
} from "@/lib/response";
import { toNumberOrNull } from "@/lib/serialization";
import { parseBody } from "@/lib/validator";
import { IPropertyLean, IPropertyImageLean, IFavoriteLean } from "@/types";

const createSchema = z.object({
  property_id: z.string().min(1),
});

type PropertyCardShape = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  city: string;
  state: string;
  primary_image_url: string | null;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  average_rating: number | null;
};

async function buildPropertyCard(
  propertyId: string,
  ratingById: Map<string, number | null>,
) {
  const property = await Property.findOne({
    _id: propertyId,
    deleted_at: null,
  }).lean<IPropertyLean | null>();

  if (!property) return null;

  const primary = await PropertyImage.findOne({
    property_id: propertyId,
    is_primary: true,
  }).lean<IPropertyImageLean | null>();

  return {
    id: String(property._id),
    title: property.title,
    description: property.description ?? null,
    price: toNumberOrNull(property.price as unknown as object) ?? Number(property.price) ?? 0,
    city: property.city,
    state: property.state,
    primary_image_url: primary?.url ?? null,
    property_type: property.property_type as string,
    listing_type: property.listing_type as string,
    bedrooms: property.bedrooms ?? null,
    bathrooms: toNumberOrNull(property.bathrooms as unknown as object),
    average_rating: ratingById.get(String(property._id)) ?? null,
  } satisfies PropertyCardShape;
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

    const property = await Property.findOne({
      _id: parsed.data.property_id,
      deleted_at: null,
    })
      .select("_id")
      .lean<IPropertyLean | null>();

    if (!property) {
      return notFound("Property not found");
    }

    try {
      const favorite = await Favorite.create({
        user_id: session.user.id,
        property_id: parsed.data.property_id,
      });
      return created(favorite.toJSON());
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: number }).code === 11000
      ) {
        return conflict("Property already favorited");
      }
      throw err;
    }
  } catch (err) {
    console.error("[favorites] POST", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const favorites = await Favorite.find({ user_id: session.user.id })
      .sort({ created_at: -1 })
      .select("property_id created_at")
      .lean<IFavoriteLean[]>();

    const propertyIds = favorites.map((f) => f.property_id);
    if (!propertyIds.length) {
      return ok({ data: [] as PropertyCardShape[] });
    }

    const groups = await Review.aggregate([
      {
        $match: {
          target_type: "property",
          target_id: { $in: propertyIds },
        },
      },
      {
        $group: {
          _id: "$target_id",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const ratingById = new Map<string, number | null>();
    for (const g of groups) {
      ratingById.set(
        g._id as string,
        g.avgRating != null ? Number(g.avgRating) : null,
      );
    }

    const cards = [];
    for (const id of propertyIds) {
      const card = await buildPropertyCard(id, ratingById);
      if (card) cards.push(card);
    }

    return ok({ data: cards });
  } catch (err) {
    console.error("[favorites] GET", err);
    return serverError();
  }
}
