import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, badRequest, serverError, forbidden } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().uuid();
const statusSchema = z.enum(["new", "read", "responded", "closed"]);
const bodySchema = z.object({ status: statusSchema });

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parsedId.data, deleted_at: null },
    });

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

    return ok(inquiry);
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
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, bodySchema);
    if (body instanceof Response) return body;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parsedId.data, deleted_at: null },
      select: { id: true, agent_id: true, client_id: true },
    });

    if (!inquiry) {
      return new Response(JSON.stringify({ message: "Inquiry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user.role !== "admin" && inquiry.agent_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const updated = await prisma.inquiry.update({
      where: { id: parsedId.data },
      data: { status: body.status },
    });

    await triggerNotification({
      userId: inquiry.client_id,
      type: "general",
      title: "Inquiry updated",
      body: `Your inquiry status is now: ${body.status}`,
      relatedId: inquiry.id,
    });

    return ok(updated);
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
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: parsedId.data, deleted_at: null },
      select: { id: true, agent_id: true, client_id: true },
    });

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

    await prisma.inquiry.update({
      where: { id: parsedId.data },
      data: { deleted_at: new Date() },
    });

    return ok({ message: "Inquiry deleted" });
  } catch (err) {
    console.error("[inquiries/[id]] DELETE", err);
    return serverError();
  }
}
