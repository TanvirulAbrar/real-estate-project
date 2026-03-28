import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";

export async function GET(req: Request) {
  try {
    const session = await requireSession(req);
    const count = await prisma.notification.count({
      where: { user_id: session.user.id, is_read: false },
    });
    return ok({ unread_count: count });
  } catch (err) {
    console.error("[notifications/unread-count] GET", err);
    return serverError();
  }
}

