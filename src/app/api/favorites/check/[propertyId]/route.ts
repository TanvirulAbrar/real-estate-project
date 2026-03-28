import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";

const propertyIdSchema = z.string().uuid();

export async function GET(
  req: Request,
  context: { params: Promise<{ propertyId: string }> }
) {
  try {
    const session = await requireSession(req);
    const { propertyId } = await context.params;
    const parsed = propertyIdSchema.safeParse(propertyId);
    if (!parsed.success) return badRequest("Invalid propertyId");

    const exists = await prisma.favorite.findFirst({
      where: { user_id: session.user.id, property_id: parsed.data },
      select: { id: true },
    });

    return ok(Boolean(exists));
  } catch (err) {
    console.error("[favorites/check/[propertyId]] GET", err);
    return serverError();
  }
}

