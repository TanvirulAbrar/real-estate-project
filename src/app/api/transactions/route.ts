import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, badRequest, conflict, forbidden, serverError, notFound, created } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { toNumberOrNull } from "@/lib/serialization";
import { triggerNotification } from "@/lib/notify";

const createSchema = z.object({
  property_id: z.string().uuid(),
  buyer_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  offer_id: z.string().uuid().optional().nullable(),
  sale_price: z.coerce.number().positive(),
  commission_rate: z.coerce.number().min(0).max(100),
  closing_date: z.string().datetime().optional().nullable(),
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const updateSchema = z.object({
  status: z.enum(["pending", "in_escrow", "closed", "cancelled"]).optional(),
  closing_date: z.string().datetime().optional().nullable(),
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
    const session = await requireRole(req, ["agent", "admin"]);
    void session;

    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const closingDate = parsed.data.closing_date ? new Date(parsed.data.closing_date) : null;

    const hasClosed = await prisma.transaction.findFirst({
      where: {
        property_id: parsed.data.property_id,
        status: "closed",
      },
      select: { id: true },
    });
    if (hasClosed) return conflict("Property already has a closed transaction");

    const createdTx = await prisma.transaction.create({
      data: {
        property_id: parsed.data.property_id,
        buyer_id: parsed.data.buyer_id,
        agent_id: parsed.data.agent_id,
        offer_id: parsed.data.offer_id ?? null,
        sale_price: parsed.data.sale_price as any,
        commission_rate: parsed.data.commission_rate as any,
        closing_date: closingDate,
      },
      include: {
        property: { select: { id: true, title: true, status: true } },
      },
    });

    return created(createdTx);
  } catch (err) {
    console.error("[transactions] POST", err);
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

    let where: any = {};
    if (session.user.role === "admin") {
      where = {};
    } else if (session.user.role === "agent") {
      where = { agent_id: session.user.id };
    } else {
      where = { buyer_id: session.user.id };
    }

    const [total, txs] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          property: {
            select: { id: true, title: true, city: true, state: true, status: true },
          },
          buyer: { select: { id: true, email: true, name: true } },
          agent: { select: { id: true, email: true, name: true } },
        },
      }),
    ]);

    return ok({
      data: txs.map((t) => ({
        ...t,
        sale_price: toNumberOrNull(t.sale_price) ?? 0,
        commission_rate: toNumberOrNull(t.commission_rate) ?? 0,
      })),
      pagination: pagination(total, page, limit),
    });
  } catch (err) {
    console.error("[transactions] GET", err);
    return serverError();
  }
}

