import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import {
  Property,
  Favorite,
  Inquiry,
  TransactionModel,
} from "@/lib/models";
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
import { IPropertyLean, ITransactionLean } from "@/types";

const idSchema = z.string().min(1);
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
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);
    const { id } = await context.params;
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) return badRequest("Invalid id");

    const body = await parseBody(req, bodySchema);
    if (body instanceof Response) return body;

    const property = await Property.findById(parsedId.data)
      .select("agent_id title status deleted_at")
      .lean<IPropertyLean | null>();

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

    const updated = await Property.findByIdAndUpdate(
      parsedId.data,
      { status: body.status },
      { new: true },
    ).lean<IPropertyLean | null>();

    if (!updated) return serverError();

    const pid = String(property._id);

    if (
      (body.status === "sold" || body.status === "rented") &&
      property.status !== body.status
    ) {
      const existingTransaction = await TransactionModel.findOne({
        property_id: pid,
        status: { $in: ["pending", "in_escrow", "closed"] },
      }).lean<ITransactionLean | null>();

      if (!existingTransaction) {
        await TransactionModel.create({
          property_id: pid,
          buyer_id: session.user.id,
          agent_id: property.agent_id,
          sale_price: 0,
          commission_rate: 0.03,
          status: "pending",
        });
      }
    }

    if (body.status === "sold" || body.status === "rented") {
      const [favUsers, inquiryUsers] = await Promise.all([
        Favorite.distinct("user_id", { property_id: pid }),
        Inquiry.distinct("client_id", { property_id: pid }),
      ]);
      const interested = [...new Set([...favUsers, ...inquiryUsers])];

      for (const userId of interested) {
        await triggerNotification({
          userId,
          type: "general",
          title: `Property ${body.status}`,
          body: `The property "${property.title}" has been ${body.status}.`,
          relatedId: pid,
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
