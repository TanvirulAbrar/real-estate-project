import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Inquiry, InquiryMessage, User } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { IInquiryLean, IInquiryMessageLean, IUserLean } from "@/types";

const idSchema = z.string().min(1);
const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

function computePagination<T>(
  total: number,
  page: number,
  limit: number,
  data: T[],
) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;

    const inquiry = await Inquiry.findOne({
      _id: parsedId.data,
      deleted_at: null,
    })
      .select("client_id agent_id")
      .lean<IInquiryLean | null>();

    if (!inquiry) return notFound("Inquiry not found");

    const isParticipant =
      inquiry.client_id === session.user.id ||
      inquiry.agent_id === session.user.id;
    if (!isParticipant && session.user.role !== "admin") {
      return forbidden("Forbidden");
    }

    const iid = String(inquiry._id);

    const [total, messages] = await Promise.all([
      InquiryMessage.countDocuments({ inquiry_id: iid }),
      InquiryMessage.find({ inquiry_id: iid })
        .sort({ created_at: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IInquiryMessageLean[]>(),
    ]);

    const senderIds = [...new Set(messages.map((m) => m.sender_id))];
    const senders = await User.find({ _id: { $in: senderIds } })
      .select("name role avatar_url")
      .lean<IUserLean[]>();
    const senderMap = new Map(senders.map((s) => [String(s._id), s]));

    const data = messages.map((m) => {
      const s = senderMap.get(m.sender_id);
      return {
        ...m,
        id: String(m._id),
        sender: s
          ? {
              id: m.sender_id,
              name: s.name,
              role: s.role,
              avatar_url: s.avatar_url,
            }
          : null,
      };
    });

    return ok(computePagination(total, page, limit, data));
  } catch (err) {
    console.error("[inquiries/[id]/messages] GET", err);
    return serverError();
  }
}
