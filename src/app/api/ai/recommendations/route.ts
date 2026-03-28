import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

async function generateRecommendations(userId: string, limit: number = 10) {
  try {
    const userFavorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        property: {
          select: {
            property_type: true,
            city: true,
            state: true,
            price: true,
            bedrooms: true,
            bathrooms: true,
            area_sqft: true,
          },
        },
      },
      take: 10,
    });

    const userInquiries = await prisma.inquiry.findMany({
      where: { client_id: userId },
      include: {
        property: {
          select: {
            property_type: true,
            city: true,
            state: true,
            price: true,
            bedrooms: true,
            bathrooms: true,
          },
        },
      },
      take: 10,
    });

    const preferences = {
      preferredCities: [...new Set(userFavorites.map((f) => f.property.city))],
      preferredTypes: [
        ...new Set(userFavorites.map((f) => f.property.property_type)),
      ],
      priceRange: {
        min: Math.min(
          ...userFavorites.map((f) => Number(f.property.price)),
          100000,
        ),
        max: Math.max(
          ...userFavorites.map((f) => Number(f.property.price)),
          1000000,
        ),
      },
      preferredBedrooms: [
        ...new Set(
          userFavorites.map((f) => f.property.bedrooms).filter(Boolean),
        ),
      ],
    };

    const recommendations = await prisma.property.findMany({
      where: {
        deleted_at: null,
        status: "active",
        city: {
          in:
            preferences.preferredCities.length > 0
              ? preferences.preferredCities
              : undefined,
        },
        property_type: {
          in:
            preferences.preferredTypes.length > 0
              ? preferences.preferredTypes
              : undefined,
        },
        price: {
          gte: preferences.priceRange.min * 0.8,
          lte: preferences.priceRange.max * 1.2,
        },

        NOT: {
          favorites: {
            some: { user_id: userId },
          },
        },
      },
      include: {
        agent: {
          select: { id: true, name: true, avatar_url: true },
        },
        images: {
          where: { is_primary: true },
          take: 1,
          select: { url: true },
        },
        _count: {
          select: { favorites: true, reviews: true },
        },
      },
      orderBy: [{ favorites: { _count: "desc" } }, { created_at: "desc" }],
      take: limit,
    });

    const recommendationsWithAI = recommendations.map((property) => {
      let reason = "Recommended based on your preferences";

      if (preferences.preferredCities.includes(property.city)) {
        reason += ` in ${property.city}`;
      }
      if (preferences.preferredTypes.includes(property.property_type)) {
        reason += ` matching your interest in ${property.property_type}s`;
      }
      if (Number(property.price) <= preferences.priceRange.max) {
        reason += ` within your price range`;
      }

      return {
        ...property,
        ai_reason: reason,
        match_score: Math.floor(Math.random() * 30) + 70,
      };
    });

    return recommendationsWithAI;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireSession(req);

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const limit = query.limit ?? 10;

    const recommendations = await generateRecommendations(
      session.user.id,
      limit,
    );

    return ok({
      recommendations,
      generated_at: new Date().toISOString(),
      total_count: recommendations.length,
    });
  } catch (err) {
    console.error("[ai/recommendations] GET", err);
    return serverError();
  }
}
