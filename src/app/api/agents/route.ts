import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User, Property, Review } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { forbidden, ok, serverError } from "@/lib/response";
import { IUserLean } from "@/types";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const promoteSchema = z.object({
  userId: z.string().min(1),
});

function computePagination<T>(
  total: number,
  page: number,
  limit: number,
  data: T[],
) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();
    await requireSession(req);

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const filter = { role: "agent" as const, deleted_at: null };

    const [total, agents] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("email name phone avatar_url bio role theme is_demo created_at")
        .lean<IUserLean[]>(),
    ]);

    const enriched = await Promise.all(
      agents.map(async (a) => {
        const id = String(a._id);
        const [activeListingsCount, avgAgg] = await Promise.all([
          Property.countDocuments({
            agent_id: id,
            deleted_at: null,
            status: "active",
          }),
          Review.aggregate([
            {
              $match: { target_type: "agent", target_id: id },
            },
            { $group: { _id: null, avg: { $avg: "$rating" } } },
          ]),
        ]);

        const avgRating = avgAgg[0]?.avg;

        return {
          id,
          email: a.email,
          name: a.name,
          phone: a.phone,
          avatar_url: a.avatar_url,
          bio: a.bio,
          role: a.role,
          theme: a.theme,
          is_demo: a.is_demo,
          active_listings_count: activeListingsCount,
          average_review_rating: avgRating != null ? Number(avgRating) : null,
        };
      }),
    );

    return ok(computePagination(total, page, limit, enriched));
  } catch (err) {
    console.error("[agents] GET", err);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireRole(req, ["admin"]);
    void session;

    const body = (await req.json().catch(() => null)) as unknown;
    const parsed = promoteSchema.safeParse(body);
    if (!parsed.success) {
      return forbidden("Invalid payload");
    }

    const user = await User.findOneAndUpdate(
      { _id: parsed.data.userId },
      { role: "agent" },
      { new: true, select: "email role" },
    ).lean<IUserLean | null>();

    if (!user) {
      return serverError();
    }

    return ok({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("[agents] POST", err);
    return serverError();
  }
}
