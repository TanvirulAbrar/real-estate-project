import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IReviewLean } from "@/types";

const idSchema = z.string().min(1);

const putSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional().nullable(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const review = await Review.findById(parsedId.data).lean<IReviewLean | null>();

    if (!review) {
      return notFound("Review not found");
    }

    return ok({ ...review, id: String(review._id) });
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
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const review = await Review.findById(parsedId.data)
      .select("author_id")
      .lean<IReviewLean | null>();

    if (!review) return notFound("Review not found");

    if (session.user.role !== "admin" && review.author_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    const updated = await Review.findByIdAndUpdate(
      parsedId.data,
      {
        ...(body.rating !== undefined ? { rating: body.rating } : {}),
        ...(body.comment !== undefined ? { comment: body.comment } : {}),
      },
      { new: true },
    ).lean<IReviewLean | null>();

    return ok({ ...updated!, id: String(updated!._id) });
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
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const review = await Review.findById(parsedId.data)
      .select("author_id")
      .lean<IReviewLean | null>();

    if (!review) return notFound("Review not found");

    if (session.user.role !== "admin" && review.author_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    await Review.findByIdAndDelete(parsedId.data);
    return ok({ message: "Review deleted" });
  } catch (err) {
    console.error("[reviews/[id]] DELETE", err);
    return serverError();
  }
}
