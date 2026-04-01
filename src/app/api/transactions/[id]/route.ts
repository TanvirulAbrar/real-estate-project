import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { TransactionModel, Property, User } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, badRequest, forbidden, serverError, notFound } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { triggerNotification } from "@/lib/notify";
import { toNumberOrNull } from "@/lib/serialization";
import { ITransactionLean, IPropertyLean, IUserLean } from "@/types";

const idSchema = z.string().min(1);

const putSchema = z.object({
  status: z.enum(["pending", "in_escrow", "closed", "cancelled"]).optional(),
  closing_date: z.string().datetime().optional().nullable(),
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

    const tx = await TransactionModel.findById(parsedId.data).lean<ITransactionLean | null>();

    if (!tx) return notFound("Transaction not found");

    if (session.user.role !== "admin") {
      const allowed =
        (session.user.role === "agent" && tx.agent_id === session.user.id) ||
        (session.user.role === "client" && tx.buyer_id === session.user.id);
      if (!allowed) return forbidden("Forbidden");
    }

    const [property, buyer, agent] = await Promise.all([
      Property.findById(tx.property_id).select("title status").lean<IPropertyLean | null>(),
      User.findById(tx.buyer_id).select("email name").lean<IUserLean | null>(),
      User.findById(tx.agent_id).select("email name").lean<IUserLean | null>(),
    ]);

    return ok({
      ...tx,
      id: String(tx._id),
      sale_price: toNumberOrNull(tx.sale_price as unknown) ?? Number(tx.sale_price) ?? 0,
      commission_rate:
        toNumberOrNull(tx.commission_rate as unknown) ??
        Number(tx.commission_rate) ??
        0,
      property: property
        ? {
            id: String(property._id),
            title: property.title,
            status: property.status,
          }
        : null,
      buyer: buyer
        ? { id: String(buyer._id), email: buyer.email, name: buyer.name }
        : null,
      agent: agent
        ? { id: String(agent._id), email: agent.email, name: agent.name }
        : null,
    });
  } catch (err) {
    console.error("[transactions/[id]] GET", err);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, putSchema);
    if (body instanceof Response) return body;

    const tx = await TransactionModel.findById(parsedId.data)
      .select("property_id buyer_id agent_id status")
      .lean<ITransactionLean | null>();

    if (!tx) return notFound("Transaction not found");

    if (session.user.role !== "admin" && tx.agent_id !== session.user.id) {
      return forbidden("Forbidden");
    }

    const nextStatus = body.status ?? tx.status;
    const nextClosingDate =
      body.closing_date !== undefined
        ? body.closing_date === null
          ? null
          : new Date(body.closing_date)
        : undefined;

    const updated = await TransactionModel.findByIdAndUpdate(
      tx._id,
      {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(nextClosingDate !== undefined
          ? { closing_date: nextClosingDate }
          : {}),
      },
      { new: true },
    ).lean<ITransactionLean | null>();

    if (!updated) return serverError();

    const prop = await Property.findById(tx.property_id)
      .select("status")
      .lean<IPropertyLean | null>();

    if (nextStatus === "closed") {
      await Property.findByIdAndUpdate(tx.property_id, { status: "sold" });

      await triggerNotification({
        userId: tx.buyer_id,
        type: "transaction_closed",
        title: "Transaction closed",
        body: "The transaction has been marked as closed.",
        relatedId: String(tx._id),
      });
    }

    return ok({
      ...updated,
      id: String(updated._id),
      property: prop ? { id: tx.property_id, status: prop.status } : null,
    });
  } catch (err) {
    console.error("[transactions/[id]] PUT", err);
    return serverError();
  }
}
