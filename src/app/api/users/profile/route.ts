import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  theme: z.enum(["light", "dark"]).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await requireSession(req);

    const body = await parseBody(req, profileSchema);
    if (body instanceof Response) return body;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.bio !== undefined ? { bio: body.bio } : {}),
        ...(body.theme !== undefined ? { theme: body.theme } : {}),
      },
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
        created_at: true,
      },
    });

    return ok({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("[users/profile] PUT", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireSession(req);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
        created_at: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return ok(user);
  } catch (err) {
    console.error("[users/profile] GET", err);
    return serverError();
  }
}
