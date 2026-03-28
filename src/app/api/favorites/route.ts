import { z } from "zod";
import { prisma } from "@/lib/prisma";
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

const createSchema = z.object({
  property_id: z.string().uuid(),
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
  const property = await prisma.property.findUnique({
    where: { id: propertyId, deleted_at: null },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      city: true,
      state: true,
      property_type: true,
      listing_type: true,
      bedrooms: true,
      bathrooms: true,
      images: {
        where: { is_primary: true },
        select: { url: true },
        take: 1,
      },
    },
  });

  if (!property) return null;

  return {
    id: property.id,
    title: property.title,
    description: property.description ?? null,
    price: toNumberOrNull(property.price) ?? 0,
    city: property.city,
    state: property.state,
    primary_image_url: property.images?.[0]?.url ?? null,
    property_type: property.property_type as unknown as string,
    listing_type: property.listing_type as unknown as string,
    bedrooms: property.bedrooms ?? null,
    bathrooms: toNumberOrNull(property.bathrooms),
    average_rating: ratingById.get(property.id) ?? null,
  } satisfies PropertyCardShape;
}

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);
    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const property = await prisma.property.findUnique({
      where: { id: parsed.data.property_id, deleted_at: null },
      select: { id: true },
    });
    if (!property) {
      return notFound("Property not found");
    }

    try {
      const favorite = await prisma.favorite.create({
        data: {
          user_id: session.user.id,
          property_id: parsed.data.property_id,
        },
      });
      return created(favorite);
    } catch (err: any) {
      if (err?.code === "P2002") {
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
    const session = await requireSession(req);

    const favorites = await prisma.favorite.findMany({
      where: { user_id: session.user.id },
      select: { property_id: true, created_at: true },
      orderBy: { created_at: "desc" },
    });

    const propertyIds = favorites.map((f) => f.property_id);
    if (!propertyIds.length) {
      return ok({ data: [] as PropertyCardShape[] });
    }

    const groups = await prisma.review.groupBy({
      by: ["target_id"],
      where: { target_type: "property", target_id: { in: propertyIds } },
      _avg: { rating: true },
    });

    const ratingById = new Map<string, number | null>();
    for (const g of groups) {
      ratingById.set(g.target_id, g._avg.rating ? Number(g._avg.rating) : null);
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
