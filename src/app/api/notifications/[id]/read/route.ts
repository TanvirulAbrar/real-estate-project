import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, forbidden, serverError, notFound } from "@/lib/response";
import { INotificationLean } from "@/types";

const idSchema = z.string().min(1);

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    void req;
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const notif = await Notification.findById(parsedId.data)
      .select("user_id is_read")
      .lean<INotificationLean | null>();
    if (!notif) return notFound("Notification not found");
    if (notif.user_id !== session.user.id) return forbidden("Forbidden");

    await Notification.findByIdAndUpdate(parsedId.data, { is_read: true });

    return ok({ message: "Notification marked as read" });
  } catch (err) {
    console.error("[notifications/[id]/read] PUT", err);
    return serverError();
  }
}
