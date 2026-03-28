import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { ok, badRequest, conflict, notFound, serverError } from "@/lib/response";

const querySchema = z.object({
  target_type: z.enum(["agent", "property"]),
  target_id: z.string().uuid(),
});

const createSchema = z.object({
  target_type: z.enum(["agent", "property"]),
  target_id: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const reviews = await prisma.review.findMany({
      where: {
        target_type: query.target_type,
        target_id: query.target_id,
      },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        author_id: true,
        target_type: true,
        target_id: true,
        rating: true,
        comment: true,
        created_at: true,
        updated_at: true,
      },
    });

    return ok(reviews);
  } catch (err) {
    console.error("[reviews] GET", err);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);
    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const { target_type, target_id } = parsed.data;

    if (target_type === "agent") {
      const agent = await prisma.user.findUnique({
        where: { id: target_id, role: "agent", deleted_at: null } as any,
        select: { id: true },
      });
      if (!agent) return notFound("Agent not found");
    } else {
      const property = await prisma.property.findUnique({
        where: { id: target_id, deleted_at: null } as any,
        select: { id: true },
      });
      if (!property) return notFound("Property not found");
    }

    try {
      const created = await prisma.review.create({
        data: {
          author_id: session.user.id,
          target_type,
          target_id,
          rating: parsed.data.rating,
          comment: parsed.data.comment ?? null,
        },
      });
      return Response.json(created, { status: 201, headers: { "Content-Type": "application/json" } });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return conflict("Review already exists for this target");
      }
      throw err;
    }
  } catch (err) {
    console.error("[reviews] POST", err);
    return serverError();
  }
}

