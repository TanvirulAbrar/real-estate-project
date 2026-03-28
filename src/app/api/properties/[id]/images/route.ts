import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const postSchema = z.object({
  urls: z.array(z.string().url()).min(1),
});

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

export async function GET(_req: Request, context: HandlerContext) {
  try {
    const params = await context.params;
    const property = await prisma.property.findUnique({
      where: { id: params.id, deleted_at: null },
      select: { id: true },
    });
    if (!property) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const images = await prisma.propertyImage.findMany({
      where: { property_id: params.id },
      orderBy: { display_order: "asc" },
      select: { id: true, url: true, is_primary: true, display_order: true },
    });

    return ok({ property_id: params.id, images });
  } catch (err) {
    console.error("[properties/[id]/images] GET", err);
    return serverError();
  }
}

export async function POST(req: Request, context: HandlerContext) {
  try {
    const params = await context.params;
    const session = await requireRole(req, ["agent", "admin"]);

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { id: true, agent_id: true, deleted_at: true },
    });
    if (!property || property.deleted_at) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin" && property.agent_id !== session.user.id) {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await parseBody(req, postSchema);
    if (body instanceof Response) return body;
    if (body.urls.length === 0) return badRequest("urls cannot be empty");

    const primaryCount = await prisma.propertyImage.count({
      where: { property_id: property.id, is_primary: true },
    });

    const data = body.urls.map((url, idx) => ({
      property_id: property.id,
      url,
      display_order: idx,
      is_primary: primaryCount === 0 && idx === 0,
    }));

    await prisma.propertyImage.createMany({ data });

    const images = await prisma.propertyImage.findMany({
      where: { property_id: property.id },
      orderBy: { display_order: "asc" },
      select: { id: true, url: true, is_primary: true, display_order: true },
    });

    return Response.json(images, { status: 201 });
  } catch (err) {
    console.error("[properties/[id]/images] POST", err);
    return serverError();
  }
}

