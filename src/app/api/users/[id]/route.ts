import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { HttpError, requireSession } from "@/lib/auth";
import { badRequest, forbidden, ok, serverError } from "@/lib/response";

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
    const session = await requireSession(req);
    const params = await context.params;

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user || user.deleted_at) {
      throw new HttpError(404, "User not found");
    }

    if (session.user.role !== "admin" && session.user.id !== user.id) {
      return forbidden("Forbidden");
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

    const user = await prisma.user.update({
      where: { id: params.id },
      data: parsed.data,
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
      },
    });

    return ok(user);
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
    const session = await requireSession(req);
    const params = await context.params;

    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return forbidden("Forbidden");
    }

    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user || user.deleted_at) throw new HttpError(404, "User not found");

    await prisma.user.update({
      where: { id: params.id },
      data: { deleted_at: new Date() },
    });

    return ok({ message: "User deleted" });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ message: err.message }, { status: err.status });
    }
    console.error("[users/[id]] DELETE", err);
    return serverError();
  }
}

