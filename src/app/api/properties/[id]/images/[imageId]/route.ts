import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const putSchema = z.object({
  is_primary: z.boolean().optional(),
  display_order: z.coerce.number().int().min(0).optional(),
});

type Params = { id: string; imageId: string };
type HandlerContext = { params: Promise<Params> };

export async function PUT(
  req: Request,
  context: HandlerContext
) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const image = await prisma.propertyImage.findUnique({
      where: { id: params.imageId },
      select: { id: true, property_id: true },
    });
    if (!image || image.property_id !== params.id) {
      return new Response(JSON.stringify({ message: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    if (body.is_primary === true) {
      await prisma.propertyImage.updateMany({
        where: {
          property_id: params.id,
          id: { not: params.imageId },
        },
        data: { is_primary: false },
      });
    }

    const updated = await prisma.propertyImage.update({
      where: { id: params.imageId },
      data: {
        ...(body.is_primary !== undefined ? { is_primary: body.is_primary } : {}),
        ...(body.display_order !== undefined
          ? { display_order: body.display_order }
          : {}),
      },
    });

    return ok(updated);
  } catch (err) {
    console.error("[properties/[id]/images/[imageId]] PUT", err);
    return serverError();
  }
}

export async function DELETE(
  req: Request,
  context: HandlerContext
) {
  try {
    const session = await requireRole(req, ["agent", "admin"]);
    const params = await context.params;

    const image = await prisma.propertyImage.findUnique({
      where: { id: params.imageId },
      select: { id: true, property_id: true },
    });
    if (!image || image.property_id !== params.id) {
      return new Response(JSON.stringify({ message: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    await prisma.propertyImage.delete({ where: { id: params.imageId } });
    return ok({ message: "Image deleted" });
  } catch (err) {
    console.error("[properties/[id]/images/[imageId]] DELETE", err);
    return serverError();
  }
}

