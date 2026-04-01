import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property, PropertyImage } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IPropertyImageLean, IPropertyLean } from "@/types";

const putSchema = z.object({
  is_primary: z.boolean().optional(),
  display_order: z.coerce.number().int().min(0).optional(),
});

type Params = { id: string; imageId: string };
type HandlerContext = { params: Promise<Params> };

export async function PUT(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const image = await PropertyImage.findById(params.imageId)
      .select("property_id")
      .lean<IPropertyImageLean | null>();
    if (!image || image.property_id !== params.id) {
      return new Response(JSON.stringify({ message: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const property = await Property.findById(params.id)
      .select("agent_id deleted_at")
      .lean<IPropertyLean | null>();
    if (!property || property.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      session.user.role !== "admin" &&
      property.agent_id !== session.user.id
    ) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    if (body.is_primary === true) {
      await PropertyImage.updateMany(
        {
          property_id: params.id,
          _id: { $ne: params.imageId },
        },
        { is_primary: false },
      );
    }

    const updated = await PropertyImage.findByIdAndUpdate(
      params.imageId,
      {
        ...(body.is_primary !== undefined ? { is_primary: body.is_primary } : {}),
        ...(body.display_order !== undefined
          ? { display_order: body.display_order }
          : {}),
      },
      { new: true },
    ).lean<IPropertyImageLean | null>();

    return ok({
      id: String(updated!._id),
      property_id: updated!.property_id,
      url: updated!.url,
      is_primary: updated!.is_primary,
      display_order: updated!.display_order,
    });
  } catch (err) {
    console.error("[properties/[id]/images/[imageId]] PUT", err);
    return serverError();
  }
}

export async function DELETE(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const image = await PropertyImage.findById(params.imageId)
      .select("property_id")
      .lean<IPropertyImageLean | null>();
    if (!image || image.property_id !== params.id) {
      return new Response(JSON.stringify({ message: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const property = await Property.findById(params.id)
      .select("agent_id deleted_at")
      .lean<IPropertyLean | null>();
    if (!property || property.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      session.user.role !== "admin" &&
      property.agent_id !== session.user.id
    ) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await PropertyImage.findByIdAndDelete(params.imageId);
    return ok({ message: "Image deleted" });
  } catch (err) {
    console.error("[properties/[id]/images/[imageId]] DELETE", err);
    return serverError();
  }
}
