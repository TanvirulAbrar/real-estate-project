import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IUserLean } from "@/types";

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  theme: z.enum(["light", "dark"]).optional(),
  avatar_url: z.string().url().optional().nullable(),
});

export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const body = await parseBody(req, profileSchema);
    if (body instanceof Response) return body;

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.bio !== undefined) data.bio = body.bio;
    if (body.theme !== undefined) data.theme = body.theme;
    if (body.avatar_url !== undefined) data.avatar_url = body.avatar_url;

    const updated = await User.findByIdAndUpdate(session.user.id, data, {
      new: true,
      select:
        "email name phone avatar_url bio role theme is_demo created_at",
    }).lean<IUserLean | null>();

    if (!updated) return serverError();

    return ok({
      message: "Profile updated",
      user: {
        id: String(updated._id),
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
        avatar_url: updated.avatar_url,
        bio: updated.bio,
        role: updated.role,
        theme: updated.theme,
        is_demo: updated.is_demo,
        created_at: updated.created_at,
      },
    });
  } catch (err) {
    console.error("[users/profile] PUT", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const user = await User.findById(session.user.id)
      .select(
        "email name phone avatar_url bio role theme is_demo created_at",
      )
      .lean<IUserLean | null>();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      created_at: user.created_at,
    });
  } catch (err) {
    console.error("[users/profile] GET", err);
    return serverError();
  }
}
