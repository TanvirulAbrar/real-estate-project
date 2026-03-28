import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { ok, badRequest, serverError } from "@/lib/response";
import { toNumberOrNull } from "@/lib/serialization";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  property_type: z
    .enum([
      "house",
      "apartment",
      "condo",
      "townhouse",
      "land",
      "commercial",
      "other",
    ])
    .optional(),
  listing_type: z.enum(["sale", "rent"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  min_bedrooms: z.coerce.number().int().min(0).optional(),
  min_bathrooms: z.coerce.number().positive().optional(),
  sort_by: z
    .enum(["price_asc", "price_desc", "newest", "oldest"])
    .optional(),
});

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  property_type: z.enum([
    "house",
    "apartment",
    "condo",
    "townhouse",
    "land",
    "commercial",
    "other",
  ]),
  listing_type: z.enum(["sale", "rent"]),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().positive().optional().nullable(),
  area_sqft: z.coerce.number().positive().optional().nullable(),
  year_built: z.coerce.number().int().min(1800).max(3000).optional().nullable(),
  status: z
    .enum(["active", "pending", "sold", "rented", "inactive"])
    .optional(),
});

function pagination(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  };
}

function sortToOrderBy(sort_by: string | undefined) {
  switch (sort_by) {
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "oldest":
      return { created_at: "asc" as const };
    case "newest":
    default:
      return { created_at: "desc" as const };
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    if (
      query.min_price !== undefined &&
      query.max_price !== undefined &&
      query.min_price > query.max_price
    ) {
      return badRequest("min_price cannot be greater than max_price");
    }

    const where: any = {
      deleted_at: null,
    };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
        { city: { contains: query.q, mode: "insensitive" } },
        { address: { contains: query.q, mode: "insensitive" } },
      ];
    }

    if (query.min_price !== undefined || query.max_price !== undefined) {
      where.price = {};
      if (query.min_price !== undefined) where.price.gte = query.min_price;
      if (query.max_price !== undefined) where.price.lte = query.max_price;
    }

    if (query.property_type) where.property_type = query.property_type;
    if (query.listing_type) where.listing_type = query.listing_type;
    if (query.city) where.city = { equals: query.city, mode: "insensitive" };
    if (query.state) where.state = { equals: query.state, mode: "insensitive" };
    if (query.min_bedrooms !== undefined)
      where.bedrooms = { gte: query.min_bedrooms };
    if (query.min_bathrooms !== undefined)
      where.bathrooms = { gte: query.min_bathrooms };

    const orderBy = sortToOrderBy(query.sort_by);

    const [total, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
      }),
    ]);

    const ids = properties.map((p) => p.id);
    const avgByProperty = new Map<string, number | null>();

    if (ids.length) {
      const groups = await prisma.review.groupBy({
        by: ["target_id"],
        where: {
          target_type: "property",
          target_id: { in: ids },
        },
        _avg: { rating: true },
      });

      for (const g of groups) {
        avgByProperty.set(
          g.target_id,
          g._avg.rating ? Number(g._avg.rating) : null
        );
      }
    }

    const data = properties.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? null,
      price: toNumberOrNull(p.price) ?? 0,
      city: p.city,
      state: p.state,
      primary_image_url: p.images?.[0]?.url ?? null,
      property_type: p.property_type,
      listing_type: p.listing_type,
      bedrooms: p.bedrooms ?? null,
      bathrooms: toNumberOrNull(p.bathrooms),
      average_rating: avgByProperty.get(p.id) ?? null,
    }));

    return ok({
      data,
      pagination: pagination(total, page, limit),
    });
  } catch (err) {
    console.error("[properties] GET", err);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    void session;

    const raw = await req.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const body = parsed.data;

    if (body.price <= 0) return badRequest("price must be a positive number");

    const created = await prisma.property.create({
      data: {
        agent_id: session.user.id,
        title: body.title,
        description: body.description ?? null,
        price: body.price as any,
        address: body.address,
        city: body.city,
        state: body.state,
        zip_code: body.zip_code ?? "",
        country: body.country ?? "US",
        property_type: body.property_type,
        listing_type: body.listing_type,
        bedrooms: body.bedrooms ?? null,
        bathrooms: body.bathrooms ?? null,
        area_sqft: body.area_sqft ?? null,
        year_built: body.year_built ?? null,
        status: body.status ?? "active",
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        address: true,
        city: true,
        state: true,
        zip_code: true,
        country: true,
        property_type: true,
        listing_type: true,
        bedrooms: true,
        bathrooms: true,
        area_sqft: true,
        year_built: true,
        status: true,
        agent_id: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    });

    return Response.json(created, { status: 201 });
  } catch (err) {
    console.error("[properties] POST", err);
    return serverError();
  }
}

