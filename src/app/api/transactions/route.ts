import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { TransactionModel, Property, User } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import {
  ok,
  badRequest,
  conflict,
  serverError,
  created,
} from "@/lib/response";
import { ITransactionLean, IPropertyLean, IUserLean } from "@/types";
import { parseQuery } from "@/lib/validator";
import { toNumberOrNull } from "@/lib/serialization";

const createSchema = z.object({
  property_id: z.string().min(1),
  buyer_id: z.string().min(1),
  agent_id: z.string().min(1),
  offer_id: z.string().min(1).optional().nullable(),
  sale_price: z.coerce.number().positive(),
  commission_rate: z.coerce.number().min(0).max(100),
  closing_date: z.string().datetime().optional().nullable(),
});

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
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    void session;

    const raw = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return badRequest("Validation failed", parsed.error.flatten());
    }

    const closingDate = parsed.data.closing_date
      ? new Date(parsed.data.closing_date)
      : null;

    const hasClosed = await TransactionModel.findOne({
      property_id: parsed.data.property_id,
      status: "closed",
    })
      .select("_id")
      .lean<ITransactionLean | null>();
    if (hasClosed) return conflict("Property already has a closed transaction");

    const createdTx = await TransactionModel.create({
      property_id: parsed.data.property_id,
      buyer_id: parsed.data.buyer_id,
      agent_id: parsed.data.agent_id,
      offer_id: parsed.data.offer_id ?? undefined,
      sale_price: parsed.data.sale_price,
      commission_rate: parsed.data.commission_rate,
      closing_date: closingDate ?? undefined,
    });

    const prop = await Property.findById(parsed.data.property_id)
      .select("title status")
      .lean<IPropertyLean | null>();

    return created({
      ...createdTx.toJSON(),
      property: prop
        ? { id: String(prop._id), title: prop.title, status: prop.status }
        : null,
    });
  } catch (err) {
    console.error("[transactions] POST", err);
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    const url = new URL(req.url);
    const q = parseQuery(url.searchParams, querySchema);
    if (q instanceof Response) return q;

    const page = q.page ?? 1;
    const limit = q.limit ?? 20;

    let filter: Record<string, unknown> = {};
    if (session.user.role === "admin") {
      filter = {};
    } else if (session.user.role === "agent") {
      filter = { agent_id: session.user.id };
    } else {
      filter = { buyer_id: session.user.id };
    }

    const [total, txs] = await Promise.all([
      TransactionModel.countDocuments(filter),
      TransactionModel.find(filter)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ITransactionLean[]>(),
    ]);

    const propIds = [...new Set(txs.map((t) => t.property_id))];
    const buyerIds = [...new Set(txs.map((t) => t.buyer_id))];
    const agentIds = [...new Set(txs.map((t) => t.agent_id))];

    const [properties, buyers, agents] = await Promise.all([
      Property.find({ _id: { $in: propIds } })
        .select("title city state status")
        .lean<IPropertyLean[]>(),
      User.find({ _id: { $in: buyerIds } }).select("email name").lean<IUserLean[]>(),
      User.find({ _id: { $in: agentIds } }).select("email name").lean<IUserLean[]>(),
    ]);

    const propMap = new Map(properties.map((p) => [String(p._id), p]));
    const buyerMap = new Map(buyers.map((u) => [String(u._id), u]));
    const agentMap = new Map(agents.map((u) => [String(u._id), u]));

    const data = txs.map((t) => {
      const p = propMap.get(t.property_id);
      const b = buyerMap.get(t.buyer_id);
      const a = agentMap.get(t.agent_id);
      return {
        ...t,
        id: String(t._id),
        sale_price: toNumberOrNull(t.sale_price as unknown) ?? Number(t.sale_price) ?? 0,
        commission_rate:
          toNumberOrNull(t.commission_rate as unknown) ??
          Number(t.commission_rate) ??
          0,
        property: p
          ? {
              id: String(p._id),
              title: p.title,
              city: p.city,
              state: p.state,
              status: p.status,
            }
          : null,
        buyer: b
          ? { id: String(b._id), email: b.email, name: b.name }
          : null,
        agent: a
          ? { id: String(a._id), email: a.email, name: a.name }
          : null,
      };
    });

    return ok({
      data,
      pagination: pagination(total, page, limit),
    });
  } catch (err) {
    console.error("[transactions] GET", err);
    return serverError();
  }
}
