import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";

export async function PUT(req: Request) {
  try {
    const session = await requireSession(req);

    await prisma.notification.updateMany({
      where: { user_id: session.user.id, is_read: false },
      data: { is_read: true },
    });

    return ok({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("[notifications/read-all] PUT", err);
    return serverError();
  }
}

