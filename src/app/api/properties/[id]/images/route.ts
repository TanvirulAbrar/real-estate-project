import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property, PropertyImage } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IPropertyLean, IPropertyImageLean } from "@/types";

const postSchema = z.object({
  urls: z.array(z.string().url()).min(1),
});

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

export async function GET(_req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const params = await context.params;
    const property = await Property.findOne({
      _id: params.id,
      deleted_at: null,
    })
      .select("_id")
      .lean<IPropertyLean | null>();
    if (!property) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const images = await PropertyImage.find({ property_id: params.id })
      .sort({ display_order: 1 })
      .select("url is_primary display_order")
      .lean<IPropertyImageLean[]>();

    const mapped = images.map((img) => ({
      id: String(img._id),
      url: img.url,
      is_primary: img.is_primary,
      display_order: img.display_order,
    }));

    return ok({ property_id: params.id, images: mapped });
  } catch (err) {
    console.error("[properties/[id]/images] GET", err);
    return serverError();
  }
}

export async function POST(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const params = await context.params;
    const session = await requireRole(req, ["agent", "admin"]);

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

    const body = await parseBody(req, postSchema);
    if (body instanceof Response) return body;
    if (body.urls.length === 0) return badRequest("urls cannot be empty");

    const pid = String(property._id);

    const primaryCount = await PropertyImage.countDocuments({
      property_id: pid,
      is_primary: true,
    });

    const docs = body.urls.map((url, idx) => ({
      property_id: pid,
      url,
      display_order: idx,
      is_primary: primaryCount === 0 && idx === 0,
    }));

    await PropertyImage.insertMany(docs);

    const list = await PropertyImage.find({ property_id: pid })
      .sort({ display_order: 1 })
      .lean<IPropertyImageLean[]>();

    const mapped = list.map((img) => ({
      id: String(img._id),
      url: img.url,
      is_primary: img.is_primary,
      display_order: img.display_order,
    }));

    return Response.json(mapped, { status: 201 });
  } catch (err) {
    console.error("[properties/[id]/images] POST", err);
    return serverError();
  }
}
