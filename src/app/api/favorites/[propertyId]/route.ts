import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError, notFound } from "@/lib/response";

const propertyIdSchema = z.string().uuid();

export async function DELETE(
  req: Request,
  context: { params: Promise<{ propertyId: string }> }
) {
  try {
    const session = await requireSession(req);
    const { propertyId } = await context.params;
    const parsed = propertyIdSchema.safeParse(propertyId);
    if (!parsed.success) return badRequest("Invalid propertyId");

    const existing = await prisma.favorite.findFirst({
      where: { user_id: session.user.id, property_id: parsed.data },
      select: { id: true },
    });

    if (!existing) return notFound("Favorite not found");

    await prisma.favorite.deleteMany({
      where: { user_id: session.user.id, property_id: parsed.data },
    });

    return ok({ message: "Favorite deleted" });
  } catch (err) {
    console.error("[favorites/[propertyId]] DELETE", err);
    return serverError();
  }
}

