import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { requireRole, HttpError, type UserRole } from "@/lib/auth";
import { parseBody } from "@/lib/validator";
import { ok, serverError } from "@/lib/response";
import { IUserLean } from "@/types";

const schema = z.object({
  userId: z.string().min(1).optional(),
  id: z.string().min(1).optional(),
  role: z.enum(["client", "agent", "admin"]),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireRole(req, ["admin"]);
    void session;

    const body = await parseBody(req, schema);
    if (body instanceof Response) return body;

    const userId = body.userId ?? body.id;
    if (!userId)
      return new Response(JSON.stringify({ message: "Missing userId" }), {
        status: 400,
      });

    const user = await User.findByIdAndUpdate(
      userId,
      { role: body.role as UserRole },
      { new: true, select: "id email role" },
    ).lean<IUserLean | null>();

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return ok({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });
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
