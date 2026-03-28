import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  forbidden,
  serverError,
} from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const createSchema = z.object({
  property_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  notes: z.string().max(2000).optional().nullable(),
});

const listQuerySchema = z.object({});

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);
    void session;

    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const scheduledAt = new Date(parsed.data.scheduled_at);
    if (scheduledAt.getTime() < Date.now()) {
      return badRequest("scheduled_at cannot be in the past");
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

    const conflict = await prisma.appointment.findFirst({
      where: {
        agent_id: parsed.data.agent_id,
        status: "confirmed",
        scheduled_at: scheduledAt,
        deleted_at: null,
      },
      select: { id: true },
    });
    if (conflict) {
      return new Response(JSON.stringify({ message: "Appointment conflict" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        property_id: parsed.data.property_id,
        client_id: session.user.id,
        agent_id: parsed.data.agent_id,
        scheduled_at: scheduledAt,
        notes: parsed.data.notes ?? null,
        status: "pending",
      },
    });

    await triggerNotification({
      userId: parsed.data.agent_id,
      type: "appointment_scheduled",
      title: "Appointment scheduled",
      body: `Client scheduled a showing for ${scheduledAt.toISOString()}`,
      relatedId: appointment.id,
    });

    return created(appointment);
  } catch (err) {
    console.error("[appointments] POST", err);
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

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { scheduled_at: "asc" },
      include: {
        property: {
          select: { id: true, title: true, city: true, state: true },
        },
      },
    });

    return ok(appointments);
  } catch (err) {
    console.error("[appointments] GET", err);
    return serverError();
  }
}
