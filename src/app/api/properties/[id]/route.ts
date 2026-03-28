import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { toNumberOrNull } from "@/lib/serialization";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive().optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
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
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().positive().optional().nullable(),
  area_sqft: z.coerce.number().positive().optional().nullable(),
  year_built: z
    .coerce.number()
    .int()
    .min(1800)
    .max(3000)
    .optional()
    .nullable(),
  status: z.enum(["active", "pending", "sold", "rented", "inactive"]).optional(),
});

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

export async function GET(_req: Request, context: HandlerContext) {
  try {
    const params = await context.params;
    const property = await prisma.property.findUnique({
      where: { id: params.id, deleted_at: null },
      include: {
        images: {
          select: { id: true, url: true, is_primary: true, display_order: true },
        },
        agent: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatar_url: true,
            role: true,
          },
        },
      },
    });

    if (!property) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return ok({
      ...property,
      price: toNumberOrNull(property.price),
      bathrooms: toNumberOrNull(property.bathrooms),
      area_sqft: toNumberOrNull(property.area_sqft),
    });
  } catch (err) {
    console.error("[properties/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(req: Request, context: HandlerContext) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const existing = await prisma.property.findUnique({
      where: { id: params.id },
      select: { id: true, agent_id: true, deleted_at: true },
    });
    if (!existing || existing.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin" && existing.agent_id !== session.user.id) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const raw = await req.json();
    const parsed = updateSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const updated = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        price: parsed.data.price !== undefined ? (parsed.data.price as any) : undefined,
      },
      include: {
        images: {
          select: { id: true, url: true, is_primary: true, display_order: true },
        },
        agent: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatar_url: true,
            role: true,
          },
        },
      },
    });

    return ok({
      ...updated,
      price: toNumberOrNull(updated.price),
      bathrooms: toNumberOrNull(updated.bathrooms),
      area_sqft: toNumberOrNull(updated.area_sqft),
    });
  } catch (err) {
    console.error("[properties/[id]] PUT", err);
    return serverError();
  }
}

export async function DELETE(req: Request, context: HandlerContext) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const existing = await prisma.property.findUnique({
      where: { id: params.id },
      select: { id: true, agent_id: true, deleted_at: true },
    });

    if (!existing || existing.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin" && existing.agent_id !== session.user.id) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.property.update({
      where: { id: params.id },
      data: { deleted_at: new Date() },
    });

    return ok({ message: "Property deleted" });
  } catch (err) {
    console.error("[properties/[id]] DELETE", err);
    return serverError();
  }
}

