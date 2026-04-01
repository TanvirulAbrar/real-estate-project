import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property } from "@/lib/models";
import { ok, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { escapeRegex } from "@/lib/mongoHelpers";
import { IPropertyLean } from "@/types";

const querySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const limit = query.limit ?? 10;
    const rx = new RegExp(escapeRegex(query.q), "i");

    const cities = await Property.find({
      deleted_at: null,
      city: rx,
    })
      .distinct("city");

    const allPropertyTypes = [
      "house",
      "apartment",
      "condo",
      "townhouse",
      "land",
      "commercial",
      "other",
    ];
    const searchTerm = query.q.toLowerCase();
    const matchingPropertyTypes = allPropertyTypes.filter((type) =>
      type.toLowerCase().includes(searchTerm),
    );

    const states = await Property.find({
      deleted_at: null,
      state: rx,
    })
      .distinct("state");

    const titleDocs = await Property.find({
      deleted_at: null,
      title: rx,
    })
      .select("title city state")
      .limit(limit)
      .lean<IPropertyLean[]>();

    const titles = titleDocs.map((p) => ({
      id: String(p._id),
      title: p.title,
      city: p.city,
      state: p.state,
    }));

    const suggestions = {
      cities: cities.slice(0, limit),
      property_types: matchingPropertyTypes,
      states: states.slice(0, limit),
      properties: titles,
    };

    return ok(suggestions);
  } catch (err) {
    console.error("[search/suggestions] GET", err);
    return serverError();
  }
}
