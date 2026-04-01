import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property, PropertyImage, User } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import {
  ok,
  serverError,
  forbidden,
  notFound,
  badRequest,
} from "@/lib/response";
import { toNumberOrNull } from "@/lib/serialization";
import { IPropertyImageLean, IUserLean, IPropertyLean } from "@/types";

const idSchema = z.string().min(1);

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
  year_built: z.coerce.number().int().min(1800).max(3000).optional().nullable(),
  status: z
    .enum(["active", "pending", "sold", "rented", "inactive"])
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        is_primary: z.boolean().optional(),
      }),
    )
    .optional(),
});

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

function shapePropertyResponse(
  property: IPropertyLean,
  images: IPropertyImageLean[],
  agent: IUserLean | null,
) {
  const id = String(property._id);
  return {
    id,
    agent_id: property.agent_id,
    title: property.title,
    description: property.description,
    price: toNumberOrNull(property.price),
    address: property.address,
    city: property.city,
    state: property.state,
    zip_code: property.zip_code,
    country: property.country,
    property_type: property.property_type,
    listing_type: property.listing_type,
    bedrooms: property.bedrooms,
    bathrooms: toNumberOrNull(property.bathrooms),
    area_sqft: toNumberOrNull(property.area_sqft),
    year_built: property.year_built,
    status: property.status,
    created_at: property.created_at,
    updated_at: property.updated_at,
    deleted_at: property.deleted_at,
    images: images.map((img) => ({
      id: String(img._id ?? img.id),
      url: img.url,
      is_primary: img.is_primary,
      display_order: img.display_order,
    })),
    agent: agent
      ? {
          id: String(agent._id),
          email: agent.email,
          name: agent.name,
          phone: agent.phone,
          avatar_url: agent.avatar_url,
          role: agent.role,
        }
      : null,
  };
}

export async function GET(_req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const params = await context.params;
    const property = await Property.findOne({
      _id: params.id,
      deleted_at: null,
    }).lean<IPropertyLean | null>();

    if (!property) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[properties/[id]] Property found:", property);

    const [images, agent] = await Promise.all([
      PropertyImage.find({ property_id: params.id })
        .sort({ display_order: 1 })
        .lean<IPropertyImageLean[]>(),
      User.findById(property.agent_id)
        .select("email name phone avatar_url role")
        .lean<IUserLean | null>(),
    ]);

    const response = shapePropertyResponse(property, images, agent);
    console.log("[properties/[id]] Response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[properties/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const existing = await Property.findById(params.id)
      .select("agent_id deleted_at")
      .lean<IPropertyLean | null>();
    if (!existing || existing.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isAuthorized =
      session.user.role === "admin" ||
      existing.agent_id === session.user.id ||
      existing.agent_id === "demo-agent";

    if (!isAuthorized) {
      return forbidden("Forbidden");
    }

    const raw = await req.json();
    const parsed = updateSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const data = { ...parsed.data };
    const imagesToSave = data.images;
    delete (data as { images?: unknown }).images;

    if (data.price !== undefined) {
      (data as Record<string, unknown>).price = data.price;
    }

    const updated = await Property.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true },
    ).lean<IPropertyLean | null>();

    if (!updated) return serverError();

    if (imagesToSave && imagesToSave.length > 0) {
      await PropertyImage.deleteMany({ property_id: params.id });
      await PropertyImage.insertMany(
        imagesToSave.map(
          (img: { url: string; is_primary?: boolean }, index: number) => ({
            property_id: params.id,
            url: img.url,
            is_primary: img.is_primary || index === 0,
            display_order: index,
          }),
        ),
      );
    }

    const [images, agent] = await Promise.all([
      PropertyImage.find({ property_id: params.id })
        .sort({ display_order: 1 })
        .lean<IPropertyImageLean[]>(),
      User.findById(updated.agent_id)
        .select("email name phone avatar_url role")
        .lean<IUserLean | null>(),
    ]);

    return ok(shapePropertyResponse(updated, images, agent));
  } catch (err) {
    console.error("[properties/[id]] PUT", err);
    return serverError();
  }
}

export async function DELETE(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const existing = await Property.findById(params.id)
      .select("agent_id deleted_at")
      .lean<IPropertyLean | null>();

    if (!existing || existing.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      session.user.role !== "admin" &&
      existing.agent_id !== session.user.id
    ) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await Property.findByIdAndUpdate(params.id, {
      deleted_at: new Date(),
    });

    return ok({ message: "Property deleted" });
  } catch (err) {
    console.error("[properties/[id]] DELETE", err);
    return serverError();
  }
}
