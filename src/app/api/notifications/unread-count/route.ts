import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const count = await Notification.countDocuments({
      user_id: session.user.id,
      is_read: false,
    });
    return ok({ unread_count: count });
  } catch (err) {
    console.error("[notifications/unread-count] GET", err);
    return serverError();
  }
}
