import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  ok,
  badRequest,
  forbidden,
  serverError,
  notFound,
} from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";

const idSchema = z.string().uuid();
const statusSchema = z.enum([
  "active",
  "pending",
  "sold",
  "rented",
  "inactive",
]);
const bodySchema = z.object({
  status: statusSchema,
});

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

    const property = await prisma.property.findUnique({
      where: { id: parsedId.data },
      select: {
        id: true,
        agent_id: true,
        title: true,
        status: true,
        deleted_at: true,
      },
    });

    if (!property || property.deleted_at) {
      return notFound("Property not found");
    }

    if (
      session.user.role !== "admin" &&
      property.agent_id !== session.user.id
    ) {
      return forbidden("Forbidden");
    }

    if (property.status === "sold" && body.status !== "active") {
      return badRequest("Sold properties can only be reactivated");
    }
    if (property.status === "rented" && body.status !== "active") {
      return badRequest("Rented properties can only be reactivated");
    }

    const updated = await prisma.property.update({
      where: { id: parsedId.data },
      data: { status: body.status },
    });

    if (
      (body.status === "sold" || body.status === "rented") &&
      property.status !== body.status
    ) {
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          property_id: property.id,
          status: { in: ["pending", "in_escrow", "closed"] },
        },
      });

      if (!existingTransaction) {
        await prisma.transaction.create({
          data: {
            property_id: property.id,
            buyer_id: session.user.id,
            agent_id: property.agent_id,
            sale_price: 0,
            commission_rate: 0.03,
            status: "pending",
          },
        });
      }
    }

    if (body.status === "sold" || body.status === "rented") {
      const interestedUsers = await prisma.user.findMany({
        where: {
          OR: [
            {
              favorites: {
                some: { property_id: property.id },
              },
            },
            {
              inquiries: {
                some: { property_id: property.id },
              },
            },
          ],
        },
        select: { id: true },
      });

      for (const user of interestedUsers) {
        await triggerNotification({
          userId: user.id,
          type: "general",
          title: `Property ${body.status}`,
          body: `The property "${property.title}" has been ${body.status}.`,
          relatedId: property.id,
        });
      }
    }

    return ok({
      message: `Property status updated to ${body.status}`,
      property: updated,
    });
  } catch (err) {
    console.error("[properties/[id]/status] PUT", err);
    return serverError();
  }
}
