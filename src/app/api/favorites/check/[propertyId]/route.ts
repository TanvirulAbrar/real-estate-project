import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Favorite } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { IFavoriteLean } from "@/types";

const propertyIdSchema = z.string().min(1);

export async function GET(
  req: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { propertyId } = await context.params;
    const parsed = propertyIdSchema.safeParse(propertyId);
    if (!parsed.success) return badRequest("Invalid propertyId");

    const exists = await Favorite.findOne({
      user_id: session.user.id,
      property_id: parsed.data,
    })
      .select("_id")
      .lean<IFavoriteLean | null>();

    return ok(Boolean(exists));
  } catch (err) {
    console.error("[favorites/check/[propertyId]] GET", err);
    return serverError();
  }
}
