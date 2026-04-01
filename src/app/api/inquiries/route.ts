import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Inquiry, Property } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { ok, badRequest, forbidden, serverError } from "@/lib/response";
import { triggerNotification } from "@/lib/notify";
import { IInquiryLean, IPropertyLean } from "@/types";

const createSchema = z.object({
  property_id: z.string().min(1),
  agent_id: z.string().min(1),
  message: z.string().min(1).max(2000),
  contact_phone: z.string().optional().nullable(),
});

const listQuerySchema = z.object({
  unread_only: z.coerce.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const body = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const property = await Property.findOne({
      _id: parsed.data.property_id,
      deleted_at: null,
    })
      .select("agent_id")
      .lean<IPropertyLean | null>();
    if (!property) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (property.agent_id !== parsed.data.agent_id) {
      return forbidden("Agent does not match the property listing");
    }

    const inquiry = await Inquiry.create({
      property_id: parsed.data.property_id,
      client_id: session.user.id,
      agent_id: parsed.data.agent_id,
      message: parsed.data.message,
      contact_phone: parsed.data.contact_phone ?? undefined,
      status: "new",
    });

    await triggerNotification({
      userId: parsed.data.agent_id,
      type: "inquiry_received",
      title: "New inquiry received",
      body: parsed.data.message.slice(0, 500),
      relatedId: String(inquiry._id),
    });

    return new Response(JSON.stringify(inquiry.toJSON()), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[inquiries] POST", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const url = new URL(req.url);
    const _query = parseQuery(url.searchParams, listQuerySchema);

    if (_query instanceof Response) return _query;

    const filter: Record<string, unknown> = { deleted_at: null };
    if (session.user.role === "admin") {
    } else if (session.user.role === "agent") {
      filter.agent_id = session.user.id;
    } else {
      filter.client_id = session.user.id;
    }

    const inquiries = await Inquiry.find(filter)
      .sort({ created_at: -1 })
      .lean<IInquiryLean[]>();

    const mapped = inquiries.map((i) => ({
      id: String(i._id),
      property_id: i.property_id,
      client_id: i.client_id,
      agent_id: i.agent_id,
      message: i.message,
      contact_phone: i.contact_phone,
      status: i.status,
      created_at: i.created_at,
      updated_at: i.updated_at,
    }));

    return ok(mapped);
  } catch (err) {
    console.error("[inquiries] GET", err);
    return serverError();
  }
}
