import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models";
import { ok, serverError, badRequest } from "@/lib/response";

const targetTypeSchema = z.enum(["agent", "property"]);
const targetIdSchema = z.string().min(1);

export async function GET(
  _req: Request,
  context: { params: Promise<{ targetType: string; targetId: string }> },
) {
  try {
    await connectDB();
    const { targetType, targetId } = await context.params;
    const tt = targetTypeSchema.safeParse(targetType);
    const tid = targetIdSchema.safeParse(targetId);
    if (!tt.success || !tid.success) {
      return badRequest("Invalid targetType or targetId");
    }

    const agg = await Review.aggregate([
      {
        $match: {
          target_type: tt.data,
          target_id: tid.data,
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const review_count = agg[0]?.count ?? 0;
    const average_rating =
      agg[0]?.avgRating != null ? Number(agg[0].avgRating) : null;

    return ok({ average_rating, review_count });
  } catch (err) {
    console.error("[reviews/summary/*] GET", err);
    return serverError();
  }
}
