import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { HttpError, requireSession } from "@/lib/auth";
import { forbidden, ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IUserLean } from "@/types";

const schema = z.object({
  theme: z.enum(["light", "dark"]),
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const params = await context.params;

    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return forbidden("Forbidden");
    }

    const body = await parseBody(req, schema);
    if (body instanceof Response) return body;

    const user = await User.findByIdAndUpdate(
      params.id,
      { theme: body.theme },
      { new: true, select: "theme" },
    ).lean<IUserLean | null>();

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return ok({ id: params.id, theme: user.theme ?? "light" });
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ message: err.message }, { status: err.status });
    }
    console.error("[users/[id]/preferences] PUT", err);
    return serverError();
  }
}
