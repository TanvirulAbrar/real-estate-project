import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Inquiry, InquiryMessage, Property, User } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { IInquiryLean, IPropertyLean, IUserLean } from "@/types";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().min(1);
const replySchema = z.object({
  message: z.string().min(1).max(2000),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, replySchema);
    if (body instanceof Response) return body;

    const inquiry = await Inquiry.findOne({
      _id: parsedId.data,
      deleted_at: null,
    }).lean<IInquiryLean | null>();

    if (!inquiry) return notFound("Inquiry not found");

    const isParticipant =
      inquiry.client_id === session.user.id ||
      inquiry.agent_id === session.user.id;
    if (!isParticipant && session.user.role !== "admin") {
      return forbidden("Forbidden");
    }

    const [property, clientUser, agentUser] = await Promise.all([
      Property.findById(inquiry.property_id).select("title").lean<IPropertyLean | null>(),
      User.findById(inquiry.client_id).select("name email").lean<IUserLean | null>(),
      User.findById(inquiry.agent_id).select("name email").lean<IUserLean | null>(),
    ]);

    const message = await InquiryMessage.create({
      inquiry_id: String(inquiry._id),
      sender_id: session.user.id,
      message: body.message,
    });

    if (session.user.role === "agent" && inquiry.status === "new") {
      await Inquiry.findByIdAndUpdate(inquiry._id, { status: "responded" });
    }

    const recipientId =
      session.user.id === inquiry.client_id
        ? inquiry.agent_id
        : inquiry.client_id;
    const senderName =
      session.user.role === "agent"
        ? agentUser?.name ?? "Agent"
        : clientUser?.name ?? "Client";

    await triggerNotification({
      userId: recipientId,
      type: "general",
      title: "New reply to inquiry",
      body: `${senderName} replied to your inquiry about ${property?.title ?? "a property"}`,
      relatedId: String(inquiry._id),
    });

    const sender = await User.findById(session.user.id)
      .select("name role")
      .lean<IUserLean | null>();

    return ok({
      message: "Reply sent",
      data: {
        ...message.toJSON(),
        sender: sender
          ? {
              id: String(sender._id),
              name: sender.name,
              role: sender.role,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("[inquiries/[id]/reply] POST", err);
    return serverError();
  }
}
