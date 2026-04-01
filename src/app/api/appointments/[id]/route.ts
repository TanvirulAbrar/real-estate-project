import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Appointment } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  serverError,
  forbidden,
  conflict,
  notFound,
} from "@/lib/response";
import { IAppointmentLean } from "@/types";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().min(1);

const putSchema = z.object({
  scheduled_at: z.string().datetime().optional(),
  notes: z.string().max(2000).optional().nullable(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
});

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

    const appointment = await Appointment.findOne({
      _id: parsedId.data,
      deleted_at: null,
    }).lean<IAppointmentLean | null>();

    if (!appointment) return notFound("Appointment not found");

    if (session.user.role !== "admin") {
      const allowed =
        appointment.client_id === session.user.id ||
        appointment.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    return ok({ ...appointment, id: String(appointment._id) });
  } catch (err) {
    console.error("[appointments/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const appointment = await Appointment.findOne({
      _id: parsedId.data,
      deleted_at: null,
    })
      .select("property_id client_id agent_id scheduled_at status")
      .lean<IAppointmentLean | null>();

    if (!appointment) return notFound("Appointment not found");

    if (session.user.role !== "admin") {
      const allowed =
        appointment.client_id === session.user.id ||
        appointment.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    const nextScheduledAt = body.scheduled_at
      ? new Date(body.scheduled_at)
      : appointment.scheduled_at;
    if (nextScheduledAt.getTime() < Date.now()) {
      return badRequest("scheduled_at cannot be in the past");
    }

    if (body.status === "confirmed") {
      if (session.user.role !== "admin" && session.user.role !== "agent") {
        return forbidden("Forbidden");
      }

      if (
        session.user.role === "agent" &&
        appointment.agent_id !== session.user.id
      ) {
        return forbidden("Forbidden");
      }

      const existingConfirmedAtTime = await Appointment.findOne({
        property_id: appointment.property_id,
        agent_id: appointment.agent_id,
        status: "confirmed",
        scheduled_at: body.scheduled_at
          ? new Date(body.scheduled_at)
          : new Date(appointment.scheduled_at),
        _id: { $ne: appointment._id },
      })
        .select("_id")
        .lean<IAppointmentLean | null>();

      if (existingConfirmedAtTime) {
        return conflict(
          "Agent already has a confirmed appointment at this time",
        );
      }
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointment._id,
      {
        ...(body.scheduled_at !== undefined
          ? { scheduled_at: new Date(body.scheduled_at) }
          : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
      { new: true },
    ).lean<IAppointmentLean | null>();

    if (!updated) return serverError();

    if (body.status === "confirmed") {
      await triggerNotification({
        userId: appointment.client_id,
        type: "appointment_confirmed",
        title: "Appointment confirmed",
        body: `Your appointment is confirmed for ${nextScheduledAt.toISOString()}`,
        relatedId: String(updated._id),
      });
    }

    return ok({ ...updated, id: String(updated._id) });
  } catch (err) {
    console.error("[appointments/[id]] PUT", err);
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

    const appointment = await Appointment.findOne({
      _id: parsedId.data,
      deleted_at: null,
    })
      .select("client_id agent_id")
      .lean<IAppointmentLean | null>();

    if (!appointment) return notFound("Appointment not found");

    if (session.user.role !== "admin") {
      const allowed =
        appointment.client_id === session.user.id ||
        appointment.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    await Appointment.findByIdAndUpdate(appointment._id, {
      deleted_at: new Date(),
    });

    return ok({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("[appointments/[id]] DELETE", err);
    return serverError();
  }
}
