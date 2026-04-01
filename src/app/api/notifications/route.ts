import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { INotificationLean } from "@/types";

const querySchema = z.object({
  unread_only: z.coerce.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const url = new URL(req.url);
    const q = parseQuery(url.searchParams, querySchema);
    if (q instanceof Response) return q;

    const filter: Record<string, unknown> = { user_id: session.user.id };
    if (q.unread_only) filter.is_read = false;

    const notifications = await Notification.find(filter)
      .sort({ created_at: -1 })
      .lean<INotificationLean[]>();

    const mapped = notifications.map((n) => ({
      id: String(n._id),
      user_id: n.user_id,
      type: n.type,
      title: n.title,
      body: n.body,
      is_read: n.is_read,
      related_id: n.related_id,
      created_at: n.created_at,
    }));

    return ok(mapped);
  } catch (err) {
    console.error("[notifications] GET", err);
    return serverError();
  }
}
