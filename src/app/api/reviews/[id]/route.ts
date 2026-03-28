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
import { parseBody } from "@/lib/validator";

const idSchema = z.string().uuid();

const putSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional().nullable(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const review = await prisma.review.findUnique({
      where: { id: parsedId.data },
    });

    if (!review) {
      return notFound("Review not found");
    }

    return ok(review);
  } catch (err) {
    console.error("[reviews/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const review = await prisma.review.findUnique({
      where: { id: parsedId.data },
      select: { id: true, author_id: true },
    });

    if (!review) return notFound("Review not found");

    if (session.user.role !== "admin" && review.author_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    const updated = await prisma.review.update({
      where: { id: parsedId.data },
      data: {
        ...(body.rating !== undefined ? { rating: body.rating } : {}),
        ...(body.comment !== undefined ? { comment: body.comment } : {}),
      },
    });

    return ok(updated);
  } catch (err) {
    console.error("[reviews/[id]] PUT", err);
    return serverError();
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const review = await prisma.review.findUnique({
      where: { id: parsedId.data },
      select: { id: true, author_id: true },
    });

    if (!review) return notFound("Review not found");

    if (session.user.role !== "admin" && review.author_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    await prisma.review.delete({ where: { id: parsedId.data } });
    return ok({ message: "Review deleted" });
  } catch (err) {
    console.error("[reviews/[id]] DELETE", err);
    return serverError();
  }
}
