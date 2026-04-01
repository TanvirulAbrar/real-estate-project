import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Favorite } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError, notFound } from "@/lib/response";
import { IFavoriteLean } from "@/types";

const propertyIdSchema = z.string().min(1);

export async function DELETE(
  req: Request,
  context: { params: Promise<{ propertyId: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { propertyId } = await context.params;
    const parsed = propertyIdSchema.safeParse(propertyId);
    if (!parsed.success) return badRequest("Invalid propertyId");

    const existing = await Favorite.findOne({
      user_id: session.user.id,
      property_id: parsed.data,
    })
      .select("_id")
      .lean<IFavoriteLean | null>();

    if (!existing) return notFound("Favorite not found");

    await Favorite.deleteMany({
      user_id: session.user.id,
      property_id: parsed.data,
    });

    return ok({ message: "Favorite deleted" });
  } catch (err) {
    console.error("[favorites/[propertyId]] DELETE", err);
    return serverError();
  }
}
