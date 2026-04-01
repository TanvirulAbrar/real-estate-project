import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models";

export type NotificationType =
  | "inquiry_received"
  | "offer_received"
  | "appointment_scheduled"
  | "appointment_confirmed"
  | "offer_accepted"
  | "offer_rejected"
  | "transaction_closed"
  | "general";

export async function triggerNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedId?: string;
}): Promise<void> {
  connectDB()
    .then(() =>
      Notification.create({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        related_id: params.relatedId,
      }),
    )
    .catch((err) => console.error("[notify] failed:", err));
}
