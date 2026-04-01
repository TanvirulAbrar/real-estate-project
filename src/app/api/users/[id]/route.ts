import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { HttpError } from "@/lib/auth";
import { requireSession } from "@/lib/auth";
import { User } from "@/lib/models";
import { ok, forbidden, serverError, badRequest } from "@/lib/response";
import { IUserLean } from "@/types";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional().nullable(),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
});

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

export async function GET(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const params = await context.params;

    const user = await User.findById(params.id).lean<IUserLean | null>();

    if (!user || user.deleted_at) {
      throw new HttpError(404, "User not found");
    }

    const uid = String(user._id);
    if (session.user.role !== "admin" && session.user.id !== uid) {
      return forbidden("Forbidden");
    }

    return ok({
      id: uid,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      bio: user.bio,
      role: user.role,
      theme: user.theme,
      is_demo: user.is_demo,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ message: err.message }, { status: err.status });
    }
    console.error("[users/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const params = await context.params;

    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return forbidden("Forbidden");
    }

    const raw = await req.json();
    if (raw && typeof raw === "object" && "email" in raw) {
      return badRequest("Email cannot be modified");
    }

    const parsed = updateSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const user = await User.findByIdAndUpdate(params.id, parsed.data, {
      new: true,
      select: "email name phone avatar_url bio role theme is_demo",
    }).lean<IUserLean | null>();

    if (!user) throw new HttpError(404, "User not found");

    return ok({
      id: String(user._id),
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      bio: user.bio,
      role: user.role,
      theme: user.theme,
      is_demo: user.is_demo,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ message: err.message }, { status: err.status });
    }
    console.error("[users/[id]] PUT", err);
    return serverError();
  }
}

export async function DELETE(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const params = await context.params;

    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return forbidden("Forbidden");
    }

    const user = await User.findById(params.id).lean<IUserLean | null>();
    if (!user || user.deleted_at) throw new HttpError(404, "User not found");

    await User.findByIdAndUpdate(params.id, { deleted_at: new Date() });

    return ok({ message: "User deleted" });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ message: err.message }, { status: err.status });
    }
    console.error("[users/[id]] DELETE", err);
    return serverError();
  }
}
