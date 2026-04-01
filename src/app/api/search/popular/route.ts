import { connectDB } from "@/lib/mongodb";
import { Property, Favorite } from "@/lib/models";
import { ok, serverError } from "@/lib/response";
import { toNumberOrNull } from "@/lib/serialization";
import { IPropertyLean } from "@/types";

export async function GET(_req: Request) {
  try {
    await connectDB();

    const popularCities = await Property.aggregate([
      { $match: { deleted_at: null } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const popularTypes = await Property.aggregate([
      { $match: { deleted_at: null } },
      { $group: { _id: "$property_type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topFavorited = await Favorite.aggregate([
      { $group: { _id: "$property_id", favorite_count: { $sum: 1 } } },
      { $sort: { favorite_count: -1 } },
      { $limit: 5 },
    ]);

    const topIds = topFavorited.map((t) => t._id);
    const popularPropsDocs = await Property.find({
      _id: { $in: topIds },
      deleted_at: null,
      status: "active",
    }).lean<IPropertyLean[]>();

    const countMap = new Map(
      topFavorited.map((t) => [t._id as string, t.favorite_count]),
    );

    const popularProperties = popularPropsDocs.map((p) => ({
      id: String(p._id),
      title: p.title,
      city: p.city,
      state: p.state,
      price: p.price,
      property_type: p.property_type,
      _count: { favorites: countMap.get(String(p._id)) ?? 0 },
    }));

    const priceStats = await Property.aggregate([
      { $match: { deleted_at: null, status: "active" } },
      {
        $group: {
          _id: null,
          min: { $min: "$price" },
          max: { $max: "$price" },
          avg: { $avg: "$price" },
        },
      },
    ]);

    const ps = priceStats[0];

    const popular = {
      cities: popularCities.map((c) => ({
        city: c._id,
        count: c.count,
      })),
      property_types: popularTypes.map((t) => ({
        type: t._id,
        count: t.count,
      })),
      properties: popularProperties,
      price_range: {
        min: ps ? toNumberOrNull(ps.min as unknown) : null,
        max: ps ? toNumberOrNull(ps.max as unknown) : null,
        avg: ps ? toNumberOrNull(ps.avg as unknown) : null,
      },
    };

    return ok(popular);
  } catch (err) {
    console.error("[search/popular] GET", err);
    return serverError();
  }
}
