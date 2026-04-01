import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Review, User, Property } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { ok, badRequest, conflict, notFound, serverError } from "@/lib/response";
import { IReviewLean, IUserLean, IPropertyLean } from "@/types";

const querySchema = z.object({
  target_type: z.enum(["agent", "property"]),
  target_id: z.string().min(1),
});

const createSchema = z.object({
  target_type: z.enum(["agent", "property"]),
  target_id: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const reviews = await Review.find({
      target_type: query.target_type,
      target_id: query.target_id,
    })
      .sort({ created_at: -1 })
      .lean<IReviewLean[]>();

    const mapped = reviews.map((r) => ({
      id: String(r._id),
      author_id: r.author_id,
      target_type: r.target_type,
      target_id: r.target_id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    return ok(mapped);
  } catch (err) {
    console.error("[reviews] GET", err);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const { target_type, target_id } = parsed.data;

    if (target_type === "agent") {
      const agent = await User.findOne({
        _id: target_id,
        role: "agent",
        deleted_at: null,
      })
        .select("_id")
        .lean<IUserLean | null>();
      if (!agent) return notFound("Agent not found");
    } else {
      const property = await Property.findOne({
        _id: target_id,
        deleted_at: null,
      })
        .select("_id")
        .lean<IPropertyLean | null>();
      if (!property) return notFound("Property not found");
    }

    try {
      const created = await Review.create({
        author_id: session.user.id,
        target_type,
        target_id,
        rating: parsed.data.rating,
        comment: parsed.data.comment ?? undefined,
      });
      return Response.json(created.toJSON(), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: number }).code === 11000
      ) {
        return conflict("Review already exists for this target");
      }
      throw err;
    }
  } catch (err) {
    console.error("[reviews] POST", err);
    return serverError();
  }
}
