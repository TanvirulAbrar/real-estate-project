import { prisma } from "@/lib/prisma";

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
  prisma.notification
    .create({
      data: {
        user_id: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        related_id: params.relatedId ?? null,
      },
    })
    .catch((err) => console.error("[notify] failed:", err));
}

