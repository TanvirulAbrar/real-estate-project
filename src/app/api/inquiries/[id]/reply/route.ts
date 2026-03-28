import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().uuid();
const replySchema = z.object({
  message: z.string().min(1).max(2000),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, replySchema);
    if (body instanceof Response) return body;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parsedId.data, deleted_at: null },
      include: {
        property: { select: { title: true } },
        client: { select: { name: true, email: true } },
        agent: { select: { name: true, email: true } },
      },
    });

    if (!inquiry) return notFound("Inquiry not found");

    const isParticipant =
      inquiry.client_id === session.user.id ||
      inquiry.agent_id === session.user.id;
    if (!isParticipant && session.user.role !== "admin") {
      return forbidden("Forbidden");
    }

    const message = await prisma.inquiryMessage.create({
      data: {
        inquiry_id: inquiry.id,
        sender_id: session.user.id,
        message: body.message,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    if (session.user.role === "agent" && inquiry.status === "new") {
      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { status: "responded" },
      });
    }

    const recipientId =
      session.user.id === inquiry.client_id
        ? inquiry.agent_id
        : inquiry.client_id;
    const senderName =
      session.user.role === "agent" ? inquiry.agent.name : inquiry.client.name;

    await triggerNotification({
      userId: recipientId,
      type: "general",
      title: "New reply to inquiry",
      body: `${senderName} replied to your inquiry about ${inquiry.property.title}`,
      relatedId: inquiry.id,
    });

    return ok({ message: "Reply sent", data: message });
  } catch (err) {
    console.error("[inquiries/[id]/reply] POST", err);
    return serverError();
  }
}
