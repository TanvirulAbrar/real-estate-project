import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Appointment, Property } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  forbidden,
  serverError,
} from "@/lib/response";
import { IPropertyLean, IAppointmentLean } from "@/types";
import { parseQuery } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const createSchema = z.object({
  property_id: z.string().min(1),
  agent_id: z.string().min(1),
  scheduled_at: z.string().datetime(),
  notes: z.string().max(2000).optional().nullable(),
});

const listQuerySchema = z.object({});

export async function POST(req: Request) {
  try {
    await connectDB();
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

    const conflict = await Appointment.findOne({
      agent_id: parsed.data.agent_id,
      status: "confirmed",
      scheduled_at: scheduledAt,
      deleted_at: null,
    })
      .select("_id")
      .lean<IAppointmentLean | null>();
    if (conflict) {
      return new Response(JSON.stringify({ message: "Appointment conflict" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const appointment = await Appointment.create({
      property_id: parsed.data.property_id,
      client_id: session.user.id,
      agent_id: parsed.data.agent_id,
      scheduled_at: scheduledAt,
      notes: parsed.data.notes ?? undefined,
      status: "pending",
    });

    const aid = String(appointment._id);

    await triggerNotification({
      userId: parsed.data.agent_id,
      type: "appointment_scheduled",
      title: "Appointment scheduled",
      body: `Client scheduled a showing for ${scheduledAt.toISOString()}`,
      relatedId: aid,
    });

    const prop = await Property.findById(parsed.data.property_id)
      .select("title city state")
      .lean<IPropertyLean | null>();

    return created({
      ...appointment.toJSON(),
      property: prop
        ? {
            id: String(prop._id),
            title: prop.title,
            city: prop.city,
            state: prop.state,
          }
        : null,
    });
  } catch (err) {
    console.error("[appointments] POST", err);
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

    const appointments = await Appointment.find(filter)
      .sort({ scheduled_at: 1 })
      .lean<IAppointmentLean[]>();

    const propIds = [...new Set(appointments.map((a) => a.property_id))];
    const props = await Property.find({ _id: { $in: propIds } })
      .select("title city state")
      .lean<IPropertyLean[]>();
    const propMap = new Map(props.map((p) => [String(p._id), p]));

    const out = appointments.map((a) => {
      const p = propMap.get(a.property_id);
      return {
        ...a,
        id: String(a._id),
        property: p
          ? {
              id: String(p._id),
              title: p.title,
              city: p.city,
              state: p.state,
            }
          : null,
      };
    });

    return ok(out);
  } catch (err) {
    console.error("[appointments] GET", err);
    return serverError();
  }
}
