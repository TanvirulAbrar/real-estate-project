import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { forbidden, ok, serverError } from "@/lib/response";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const promoteSchema = z.object({
  userId: z.string().uuid(),
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
    await requireSession(req);

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [total, agents] = await Promise.all([
      prisma.user.count({
        where: { role: "agent", deleted_at: null },
      }),
      prisma.user.findMany({
        where: { role: "agent", deleted_at: null },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatar_url: true,
          bio: true,
          role: true,
          theme: true,
          is_demo: true,
        },
      }),
    ]);

    const enriched = await Promise.all(
      agents.map(async (a) => {
        const [activeListingsCount, avg] = await Promise.all([
          prisma.property.count({
            where: {
              agent_id: a.id,
              deleted_at: null,
              status: "active",
            },
          }),
          prisma.review.aggregate({
            where: {
              target_type: "agent",
              target_id: a.id,
            },
            _avg: { rating: true },
          }),
        ]);

        return {
          ...a,
          active_listings_count: activeListingsCount,
          average_review_rating: avg._avg.rating
            ? Number(avg._avg.rating)
            : null,
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
    const session = await requireRole(req, ["admin"]);
    void session;

    const body = (await req.json().catch(() => null)) as unknown;
    const parsed = promoteSchema.safeParse(body);
    if (!parsed.success) {
      return forbidden("Invalid payload");
    }

    const user = await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { role: "agent" },
      select: { id: true, email: true, role: true },
    });

    return ok(user);
  } catch (err) {
    console.error("[agents] POST", err);
    return serverError();
  }
}
