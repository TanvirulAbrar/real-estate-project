import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  conflict,
  forbidden,
  serverError,
  notFound,
  unprocessable,
} from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";
import { toNumberOrNull } from "@/lib/serialization";

const createSchema = z.object({
  property_id: z.string().uuid(),
  amount: z.coerce.number().positive(),
  message: z.string().max(2000).optional().nullable(),
  expiry_date: z.string().datetime(),
});

const statusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "countered",
  "withdrawn",
]);

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

function pagination(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  };
}

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);

    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const expiryDate = new Date(parsed.data.expiry_date);
    if (expiryDate.getTime() < Date.now()) {
      return badRequest("expiry_date cannot be in the past");
    }

    const property = await prisma.property.findUnique({
      where: { id: parsed.data.property_id, deleted_at: null },
      select: { id: true, agent_id: true },
    });
    if (!property) return notFound("Property not found");

    const offer = await prisma.offer.create({
      data: {
        property_id: parsed.data.property_id,
        buyer_id: session.user.id,
        amount: parsed.data.amount as any,
        message: parsed.data.message ?? null,
        expiry_date: expiryDate,
        status: "pending",
      },
    });

    await triggerNotification({
      userId: property.agent_id,
      type: "offer_received",
      title: "New offer received",
      body: `Offer submitted: $${toNumberOrNull(offer.amount) ?? 0}`,
      relatedId: offer.id,
    });

    return created(offer);
  } catch (err) {
    console.error("[offers] POST", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireSession(req);
    const url = new URL(req.url);
    const q = parseQuery(url.searchParams, querySchema);
    if (q instanceof Response) return q;

    const page = q.page ?? 1;
    const limit = q.limit ?? 20;

    let where: any = { deleted_at: null };
    if (session.user.role === "admin") {
    } else if (session.user.role === "agent") {
      const propertyIds = await prisma.property
        .findMany({
          where: { agent_id: session.user.id, deleted_at: null },
          select: { id: true },
        })
        .then((rows) => rows.map((r) => r.id));
      where = { ...where, property_id: { in: propertyIds } };
    } else {
      where = { ...where, buyer_id: session.user.id };
    }

    const [total, offers] = await Promise.all([
      prisma.offer.count({ where }),
      prisma.offer.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          property_id: true,
          buyer_id: true,
          amount: true,
          message: true,
          expiry_date: true,
          status: true,
          created_at: true,
          updated_at: true,
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              state: true,
              images: {
                where: { is_primary: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      }),
    ]);

    return ok({
      data: offers.map((o) => ({
        ...o,
        amount: toNumberOrNull(o.amount) ?? 0,
        primary_image_url: o.property.images?.[0]?.url ?? null,
      })),
      pagination: pagination(total, page, limit),
    });
  } catch (err) {
    console.error("[offers] GET", err);
    return serverError();
  }
}
