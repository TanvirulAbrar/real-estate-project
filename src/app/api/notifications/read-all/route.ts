import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    await Notification.updateMany(
      { user_id: session.user.id, is_read: false },
      { is_read: true },
    );

    return ok({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("[notifications/read-all] PUT", err);
    return serverError();
  }
}
