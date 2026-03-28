import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, HttpError, type UserRole } from "@/lib/auth";
import { parseBody } from "@/lib/validator";
import { created, ok, serverError } from "@/lib/response";

const schema = z.object({
  userId: z.string().uuid().optional(),
  id: z.string().uuid().optional(),
  role: z.enum(["client", "agent", "admin"]),
});

export async function POST(req: Request) {
  try {
    const session = await requireRole(req, ["admin"]);
    void session;

    const body = await parseBody(req, schema);
    if (body instanceof Response) return body;

    const userId = body.userId ?? body.id;
    if (!userId)
      return new Response(JSON.stringify({ message: "Missing userId" }), {
        status: 400,
      });

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: body.role as UserRole },
      select: { id: true, email: true, role: true },
    });

    return ok(user);
  } catch (err) {
    if (err instanceof HttpError) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: err.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("[auth/assign-role]", err);
    return serverError();
  }
}
