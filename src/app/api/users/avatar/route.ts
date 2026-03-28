import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const avatarSchema = z.object({
  avatar_url: z.string().url().max(500),
});

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);

    const body = await parseBody(req, avatarSchema);
    if (body instanceof Response) return body;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar_url: body.avatar_url },
      select: {
        id: true,
        email: true,
        name: true,
        avatar_url: true,
      },
    });

    return ok({ message: "Avatar updated", user: updated });
  } catch (err) {
    console.error("[users/avatar] POST", err);
    return serverError();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireSession(req);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar_url: null },
      select: {
        id: true,
        email: true,
        name: true,
        avatar_url: true,
      },
    });

    return ok({ message: "Avatar removed", user: updated });
  } catch (err) {
    console.error("[users/avatar] DELETE", err);
    return serverError();
  }
}
