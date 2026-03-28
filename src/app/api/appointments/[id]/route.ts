import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  serverError,
  forbidden,
  conflict,
  notFound,
} from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().uuid();

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
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const appointment = await prisma.appointment.findUnique({
      where: { id: parsedId.data, deleted_at: null },
    });

    if (!appointment) return notFound("Appointment not found");

    if (session.user.role !== "admin") {
      const allowed =
        appointment.client_id === session.user.id ||
        appointment.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    return ok(appointment);
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
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const appointment = await prisma.appointment.findUnique({
      where: { id: parsedId.data, deleted_at: null },
      select: {
        id: true,
        property_id: true,
        client_id: true,
        agent_id: true,
        scheduled_at: true,
        status: true,
      },
    });

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

      const existingConfirmedAtTime = await prisma.appointment.findFirst({
        where: {
          agent_id: appointment.agent_id,
          status: "confirmed",
          scheduled_at: nextScheduledAt,
          deleted_at: null,
          NOT: { id: appointment.id },
        },
        select: { id: true },
      });

      if (existingConfirmedAtTime) {
        return conflict(
          "Agent already has a confirmed appointment at this time",
        );
      }
    }

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        ...(body.scheduled_at !== undefined
          ? { scheduled_at: nextScheduledAt }
          : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
    });

    if (body.status === "confirmed") {
      await triggerNotification({
        userId: appointment.client_id,
        type: "appointment_confirmed",
        title: "Appointment confirmed",
        body: `Your appointment is confirmed for ${nextScheduledAt.toISOString()}`,
        relatedId: updated.id,
      });
    }

    return ok(updated);
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
    const session = await requireSession(req);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const appointment = await prisma.appointment.findUnique({
      where: { id: parsedId.data, deleted_at: null },
      select: { id: true, agent_id: true, client_id: true },
    });

    if (!appointment) return notFound("Appointment not found");

    if (session.user.role !== "admin") {
      const allowed =
        appointment.client_id === session.user.id ||
        appointment.agent_id === session.user.id;
      if (!allowed) return forbidden("Forbidden");
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { deleted_at: new Date() },
    });

    return ok({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("[appointments/[id]] DELETE", err);
    return serverError();
  }
}
