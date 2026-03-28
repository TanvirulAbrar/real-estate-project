import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { HttpError, requireSession } from "@/lib/auth";
import { forbidden, ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const schema = z.object({
  theme: z.enum(["light", "dark"]),
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession(req);
    const params = await context.params;

    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return forbidden("Forbidden");
    }

    const body = await parseBody(req, schema);
    if (body instanceof Response) return body;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { theme: body.theme },
      select: { id: true, theme: true },
    });

    return ok({ id: user.id, theme: user.theme ?? "light" });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ message: err.message }, { status: err.status });
    }
    if (
      err instanceof Error &&
      err.message.includes("Record to update not found")
    ) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    console.error("[users/[id]/preferences] PUT", err);
    return serverError();
  }
}

