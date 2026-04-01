import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { requireSession, HttpError } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { IUserLean } from "@/types";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const user = await User.findById(session.user.id).lean<IUserLean | null>();

    if (!user || user.deleted_at) {
      throw new HttpError(404, "User not found");
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
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: err.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("[auth/me]", err);
    return serverError();
  }
}
