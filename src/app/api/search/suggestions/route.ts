import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";

const querySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const limit = query.limit ?? 10;
    const searchTerm = query.q.toLowerCase();

    const cities = await prisma.property.findMany({
      where: {
        deleted_at: null,
        city: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      select: { city: true },
      distinct: ["city"],
      take: limit,
    });

    const allPropertyTypes = [
      "house",
      "apartment",
      "condo",
      "townhouse",
      "land",
      "commercial",
      "other",
    ];
    const matchingPropertyTypes = allPropertyTypes.filter((type) =>
      type.toLowerCase().includes(searchTerm),
    );

    const states = await prisma.property.findMany({
      where: {
        deleted_at: null,
        state: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      select: { state: true },
      distinct: ["state"],
      take: limit,
    });

    const titles = await prisma.property.findMany({
      where: {
        deleted_at: null,
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      select: { id: true, title: true, city: true, state: true },
      take: limit,
    });

    const suggestions = {
      cities: cities.map((c) => c.city),
      property_types: matchingPropertyTypes,
      states: states.map((s) => s.state),
      properties: titles,
    };

    return ok(suggestions);
  } catch (err) {
    console.error("[search/suggestions] GET", err);
    return serverError();
  }
}
