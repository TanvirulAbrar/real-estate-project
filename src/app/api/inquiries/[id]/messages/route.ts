import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { parseQuery } from "@/lib/validator";

const idSchema = z.string().uuid();
const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
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

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parsedId.data, deleted_at: null },
      select: { id: true, client_id: true, agent_id: true },
    });

    if (!inquiry) return notFound("Inquiry not found");

    const isParticipant =
      inquiry.client_id === session.user.id ||
      inquiry.agent_id === session.user.id;
    if (!isParticipant && session.user.role !== "admin") {
      return forbidden("Forbidden");
    }

    const [total, messages] = await Promise.all([
      prisma.inquiryMessage.count({
        where: { inquiry_id: inquiry.id },
      }),
      prisma.inquiryMessage.findMany({
        where: { inquiry_id: inquiry.id },
        orderBy: { created_at: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          sender: {
            select: { id: true, name: true, role: true, avatar_url: true },
          },
        },
      }),
    ]);

    return ok(computePagination(total, page, limit, messages));
  } catch (err) {
    console.error("[inquiries/[id]/messages] GET", err);
    return serverError();
  }
}
