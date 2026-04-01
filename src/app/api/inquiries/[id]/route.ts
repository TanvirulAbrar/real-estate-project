import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Inquiry } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, badRequest, serverError, forbidden } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";
import { IInquiryLean } from "@/types";

const idSchema = z.string().min(1);
const statusSchema = z.enum(["new", "read", "responded", "closed"]);
const bodySchema = z.object({ status: statusSchema });

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

    const inquiry = await Inquiry.findOne({
      _id: parsedId.data,
      deleted_at: null,
    }).lean<IInquiryLean | null>();

    if (!inquiry) {
      return new Response(JSON.stringify({ message: "Inquiry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin") {
      const allowed =
        inquiry.client_id === session.user.id ||
        inquiry.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    return ok({ ...inquiry, id: String(inquiry._id) });
  } catch (err) {
    console.error("[inquiries/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, bodySchema);
    if (body instanceof Response) return body;

    const inquiry = await Inquiry.findOne({
      _id: parsedId.data,
      deleted_at: null,
    })
      .select("agent_id client_id")
      .lean<IInquiryLean | null>();

    if (!inquiry) {
      return new Response(JSON.stringify({ message: "Inquiry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin" && inquiry.agent_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const updated = await Inquiry.findByIdAndUpdate(
      parsedId.data,
      { status: body.status },
      { new: true },
    ).lean<IInquiryLean | null>();

    await triggerNotification({
      userId: inquiry.client_id,
      type: "general",
      title: "Inquiry updated",
      body: `Your inquiry status is now: ${body.status}`,
      relatedId: String(inquiry._id),
    });

    return ok({ ...updated!, id: String(updated!._id) });
  } catch (err) {
    console.error("[inquiries/[id]] PUT", err);
    return serverError();
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const inquiry = await Inquiry.findOne({
      _id: parsedId.data,
      deleted_at: null,
    })
      .select("agent_id client_id")
      .lean<IInquiryLean | null>();

    if (!inquiry) {
      return new Response(JSON.stringify({ message: "Inquiry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin") {
      const allowed =
        inquiry.client_id === session.user.id ||
        inquiry.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    await Inquiry.findByIdAndUpdate(parsedId.data, {
      deleted_at: new Date(),
    });

    return ok({ message: "Inquiry deleted" });
  } catch (err) {
    console.error("[inquiries/[id]] DELETE", err);
    return serverError();
  }
}
