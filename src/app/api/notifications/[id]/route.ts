import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, forbidden, serverError, notFound } from "@/lib/response";

const idSchema = z.string().uuid();

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const notif = await prisma.notification.findUnique({
      where: { id: parsedId.data },
      select: { id: true, user_id: true },
    });

    if (!notif) return notFound("Notification not found");
    if (notif.user_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    await prisma.notification.delete({ where: { id: parsedId.data } });
    return ok({ message: "Notification deleted" });
  } catch (err) {
    console.error("[notifications/[id]] DELETE", err);
    return serverError();
  }
}

