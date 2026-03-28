import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, serverError, badRequest } from "@/lib/response";

const targetTypeSchema = z.enum(["agent", "property"]);
const targetIdSchema = z.string().uuid();

export async function GET(
  _req: Request,
  context: { params: Promise<{ targetType: string; targetId: string }> }
) {
  try {
    const { targetType, targetId } = await context.params;
    const tt = targetTypeSchema.safeParse(targetType);
    const tid = targetIdSchema.safeParse(targetId);
    if (!tt.success || !tid.success) {
      return badRequest("Invalid targetType or targetId");
    }

    const agg = await prisma.review.aggregate({
      where: { target_type: tt.data, target_id: tid.data },
      _avg: { rating: true },
      _count: { _all: true },
    });

    const review_count = agg._count._all;
    const average_rating = agg._avg.rating ? Number(agg._avg.rating) : null;

    return ok({ average_rating, review_count });
  } catch (err) {
    console.error("[reviews/summary/*] GET", err);
    return serverError();
  }
}

