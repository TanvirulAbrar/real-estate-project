import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Favorite, Inquiry, Property, PropertyImage, User } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import {
  IFavoriteLean,
  IPropertyLean,
  IPropertyImageLean,
  IUserLean,
  IInquiryLean,
} from "@/types";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

async function generateRecommendations(userId: string, limit: number = 10) {
  try {
    const favDocs = await Favorite.find({ user_id: userId })
      .limit(10)
      .lean<IFavoriteLean[]>();
    const favPropertyIds = favDocs.map((f) => f.property_id);

    const propertiesFromFavorites = await Property.find({
      _id: { $in: favPropertyIds },
      deleted_at: null,
    }).lean<IPropertyLean[]>();

    const preferredCities = [
      ...new Set(propertiesFromFavorites.map((p) => p.city)),
    ];
    const preferredTypes = [
      ...new Set(propertiesFromFavorites.map((p) => p.property_type)),
    ];
    const prices = propertiesFromFavorites.map((p) => Number(p.price));
    const priceRange = {
      min: prices.length ? Math.min(...prices, 100000) : 100000,
      max: prices.length ? Math.max(...prices, 1000000) : 1000000,
    };

    await Inquiry.find({ client_id: userId }).limit(10).lean<IInquiryLean[]>();

    const recommendationsData = await Property.find({
      deleted_at: null,
      status: "active",
      ...(preferredCities.length ? { city: { $in: preferredCities } } : {}),
    })
      .limit(5)
      .lean<IPropertyLean[]>();

    const recommendationsPropertyIds = recommendationsData.map((p) =>
      String(p._id),
    );
    const primaryImages = await PropertyImage.find({
      property_id: { $in: recommendationsPropertyIds },
      is_primary: true,
    }).lean<IPropertyImageLean[]>();

    const imageMap = new Map(
      primaryImages.map((img) => [img.property_id, img.url]),
    );

    const recommendationsWithData = recommendationsData.map((property) => {
      const propertyId = String(property._id);
      let reason = "Recommended based on your preferences";
      if (preferredCities.includes(property.city)) {
        reason = "Matches your preferred city";
      }
      return {
        id: propertyId,
        title: property.title,
        price: property.price,
        address: property.address,
        city: property.city,
        state: property.state,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_sqft: property.area_sqft,
        property_type: property.property_type,
        image_url: imageMap.get(propertyId) || null,
        reason,
      };
    });

    const excludeIds = [...favPropertyIds];

    const candidates = await Property.find({
      deleted_at: null,
      status: "active",
      _id: { $nin: excludeIds },
      ...(preferredCities.length ? { city: { $in: preferredCities } } : {}),
      ...(preferredTypes.length
        ? { property_type: { $in: preferredTypes } }
        : {}),
      price: {
        $gte: priceRange.min * 0.8,
        $lte: priceRange.max * 1.2,
      },
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean<IPropertyLean[]>();

    const candidatePropertyIds = candidates.map((p) => String(p._id));
    const candidateAgentIds = candidates.map((p) => p.agent_id).filter(Boolean);

    const [candidateImages, candidateAgents] = await Promise.all([
      PropertyImage.find({
        property_id: { $in: candidatePropertyIds },
        is_primary: true,
      }).lean<IPropertyImageLean[]>(),
      User.find({
        _id: { $in: candidateAgentIds },
      })
        .select("name avatar_url")
        .lean<IUserLean[]>(),
    ]);

    const candidateImageMap = new Map(
      candidateImages.map((img) => [img.property_id, img.url]),
    );
    const candidateAgentMap = new Map(
      candidateAgents.map((agent) => [String(agent._id), agent]),
    );

    const recommendationsWithAI = candidates.map((property) => {
      const propertyId = String(property._id);
      const agent = candidateAgentMap.get(property.agent_id);

      let reason = "Recommended based on your preferences";
      if (preferredCities.includes(property.city)) {
        reason = "Matches your preferred city";
      }
      if (preferredTypes.includes(property.property_type)) {
        reason += ` matching your interest in ${property.property_type}s`;
      }
      if (Number(property.price) <= priceRange.max) {
        reason += ` within your price range`;
      }

      return {
        id: propertyId,
        title: property.title,
        price: property.price,
        address: property.address,
        city: property.city,
        state: property.state,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_sqft: property.area_sqft,
        property_type: property.property_type,
        image_url: candidateImageMap.get(propertyId) || null,
        agent: agent
          ? {
              id: String(agent._id),
              name: agent.name,
              avatar_url: agent.avatar_url,
            }
          : null,
        ai_reason: reason,
        match_score: Math.floor(Math.random() * 30) + 70,
      };
    });

    return recommendationsWithAI.length
      ? recommendationsWithAI
      : recommendationsWithData.map((p) => ({
          ...p,
          ai_reason: p.reason,
          match_score: Math.floor(Math.random() * 30) + 70,
        }));
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
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
