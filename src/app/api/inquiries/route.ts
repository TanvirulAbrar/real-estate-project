import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { parseQuery } from "@/lib/validator";
import { ok, badRequest, forbidden, serverError } from "@/lib/response";
import { triggerNotification } from "@/lib/notify";

const createSchema = z.object({
  property_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  message: z.string().min(1).max(2000),
  contact_phone: z.string().optional().nullable(),
});

const listQuerySchema = z.object({
  unread_only: z.coerce.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);

    const body = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const property = await prisma.property.findUnique({
      where: { id: parsed.data.property_id, deleted_at: null },
      select: { id: true, agent_id: true },
    });
    if (!property) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (property.agent_id !== parsed.data.agent_id) {
      return forbidden("Agent does not match the property listing");
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        property_id: parsed.data.property_id,
        client_id: session.user.id,
        agent_id: parsed.data.agent_id,
        message: parsed.data.message,
        contact_phone: parsed.data.contact_phone ?? null,
        status: "new",
      },
    });

    await triggerNotification({
      userId: parsed.data.agent_id,
      type: "inquiry_received",
      title: "New inquiry received",
      body: parsed.data.message.slice(0, 500),
      relatedId: inquiry.id,
    });

    return new Response(JSON.stringify(inquiry), {
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
    const session = await requireSession(req);

    const url = new URL(req.url);
    const _query = parseQuery(url.searchParams, listQuerySchema);

    if (_query instanceof Response) return _query;

    let where: any = { deleted_at: null };
    if (session.user.role === "admin") {
    } else if (session.user.role === "agent") {
      where = { ...where, agent_id: session.user.id };
    } else {
      where = { ...where, client_id: session.user.id };
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        property_id: true,
        client_id: true,
        agent_id: true,
        message: true,
        contact_phone: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return ok(inquiries);
  } catch (err) {
    console.error("[inquiries] GET", err);
    return serverError();
  }
}
