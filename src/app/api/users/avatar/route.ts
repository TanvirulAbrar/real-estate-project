import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IUserLean } from "@/types";

const avatarSchema = z.object({
  avatar_url: z.string().url().max(500),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const body = await parseBody(req, avatarSchema);
    if (body instanceof Response) return body;

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { avatar_url: body.avatar_url },
      { new: true, select: "email name avatar_url" },
    ).lean<IUserLean | null>();

    if (!updated) return serverError();

    return ok({
      message: "Avatar updated",
      user: {
        id: String(updated._id),
        email: updated.email,
        name: updated.name,
        avatar_url: updated.avatar_url,
      },
    });
  } catch (err) {
    console.error("[users/avatar] POST", err);
    return serverError();
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { avatar_url: null },
      { new: true, select: "email name avatar_url" },
    ).lean<IUserLean | null>();

    if (!updated) return serverError();

    return ok({
      message: "Avatar removed",
      user: {
        id: String(updated._id),
        email: updated.email,
        name: updated.name,
        avatar_url: updated.avatar_url,
      },
    });
  } catch (err) {
    console.error("[users/avatar] DELETE", err);
    return serverError();
  }
}
