import { prisma } from "@/lib/prisma";
import { requireSession, HttpError } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";

export async function GET(req: Request) {
  try {
    const session = await requireSession(req);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.deleted_at) {
      throw new HttpError(404, "User not found");
    }

    return ok({
      id: user.id,
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

