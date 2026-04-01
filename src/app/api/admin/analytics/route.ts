import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import {
  User,
  Property,
  TransactionModel,
  Offer,
  Inquiry,
  Appointment,
} from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { IUserLean, IPropertyLean, ITransactionLean, IOfferLean, IInquiryLean, IAppointmentLean } from "@/types";

const querySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    await requireRole(req, ["admin"]);

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const months = query.months ?? 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const [
      totalUsers,
      totalProperties,
      totalSales,
      revenueAgg,
      activeListings,
      pendingOffers,
      totalInquiries,
      totalAppointments,
    ] = await Promise.all([
      User.countDocuments({ deleted_at: null }),
      Property.countDocuments({ deleted_at: null }),
      TransactionModel.countDocuments({ status: "closed" }),
      TransactionModel.aggregate([
        { $match: { status: "closed" } },
        { $group: { _id: null, total: { $sum: "$sale_price" } } },
      ]),
      Property.countDocuments({ deleted_at: null, status: "active" }),
      Offer.countDocuments({ deleted_at: null, status: "pending" }),
      Inquiry.countDocuments({ deleted_at: null }),
      Appointment.countDocuments({ deleted_at: null }),
    ]);

    const totalRevenue =
      revenueAgg[0]?.total != null ? Number(revenueAgg[0].total) : 0;

    const [monthlyStats, monthlySales, monthlyUsers] = await Promise.all([
      Property.aggregate([
        {
          $match: {
            deleted_at: null,
            created_at: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              y: { $year: "$created_at" },
              m: { $month: "$created_at" },
            },
            properties_count: { $sum: 1 },
            active_properties: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
          },
        },
        { $sort: { "_id.y": -1, "_id.m": -1 } },
      ]),
      TransactionModel.aggregate([
        {
          $match: {
            status: "closed",
            created_at: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              y: { $year: "$created_at" },
              m: { $month: "$created_at" },
            },
            sales_count: { $sum: 1 },
            revenue: { $sum: "$sale_price" },
          },
        },
        { $sort: { "_id.y": -1, "_id.m": -1 } },
      ]),
      User.aggregate([
        {
          $match: {
            deleted_at: null,
            created_at: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              y: { $year: "$created_at" },
              m: { $month: "$created_at" },
            },
            users_count: { $sum: 1 },
            agents_count: {
              $sum: { $cond: [{ $eq: ["$role", "agent"] }, 1, 0] },
            },
          },
        },
        { $sort: { "_id.y": -1, "_id.m": -1 } },
      ]),
    ]);

    const formatMonth = (id: { y: number; m: number }) =>
      new Date(Date.UTC(id.y, id.m - 1, 1)).toISOString();

    const topAgentsRaw = await User.find({
      role: "agent",
      deleted_at: null,
    })
      .select("_id")
      .lean<IUserLean[]>();

    const topAgents = await Promise.all(
      topAgentsRaw.slice(0, 10).map(async (a) => {
        const id = String(a._id);
        const [properties_count, txAgg] = await Promise.all([
          Property.countDocuments({ agent_id: id, deleted_at: null }),
          TransactionModel.countDocuments({
            agent_id: id,
            status: "closed",
          }),
        ]);
        const u = (await User.findById(id).select("email name").lean<IUserLean | null>());
        return {
          id,
          email: u?.email || "",
          name: u?.name || "",
          _count: {
            properties: properties_count,
            agentTransactions: txAgg,
          },
          properties_count,
          sales_count: txAgg,
        };
      }),
    );

    const propertyTypes = await Property.aggregate([
      { $match: { deleted_at: null } },
      { $group: { _id: "$property_type", count: { $sum: 1 } } },
    ]);

    const recentActivity = await Promise.all([
      Property.find({ deleted_at: null })
        .sort({ created_at: -1 })
        .limit(5)
        .select("title created_at")
        .lean<IPropertyLean[]>(),
      Inquiry.find({ deleted_at: null })
        .sort({ created_at: -1 })
        .limit(5)
        .select("message created_at")
        .lean<IInquiryLean[]>(),
      Offer.find({ deleted_at: null })
        .sort({ created_at: -1 })
        .limit(5)
        .select("amount created_at")
        .lean<IOfferLean[]>(),
    ]);

    const analytics = {
      overview: {
        total_users: totalUsers,
        total_properties: totalProperties,
        total_sales: totalSales,
        total_revenue: totalRevenue,
        active_listings: activeListings,
        pending_offers: pendingOffers,
        total_inquiries: totalInquiries,
        total_appointments: totalAppointments,
      },
      monthly_stats: {
        properties: monthlyStats.map((r: Record<string, unknown>) => ({
          month: formatMonth(r._id as { y: number; m: number }),
          properties_count: r.properties_count,
          active_properties: r.active_properties,
        })),
        sales: monthlySales.map((r: Record<string, unknown>) => ({
          month: formatMonth(r._id as { y: number; m: number }),
          sales_count: r.sales_count,
          revenue: r.revenue,
        })),
        users: monthlyUsers.map((r: Record<string, unknown>) => ({
          month: formatMonth(r._id as { y: number; m: number }),
          users_count: r.users_count,
          agents_count: r.agents_count,
        })),
      },
      top_agents: topAgents.map((agent: Record<string, unknown>) => ({
        ...agent,
        properties_count: agent.properties_count,
        sales_count: agent.sales_count,
      })),
      property_types: propertyTypes.map(
        (t: { _id: string; count: number }) => ({
          type: t._id,
          count: t.count,
        }),
      ),
      recent_activity: {
        properties: recentActivity[0].map((p) => ({
          id: String(p._id),
          title: p.title,
          created_at: p.created_at,
        })),
        inquiries: recentActivity[1].map((i) => ({
          id: String(i._id),
          message: i.message,
          created_at: i.created_at,
        })),
        offers: recentActivity[2].map((o) => ({
          id: String(o._id),
          amount: o.amount,
          created_at: o.created_at,
        })),
      },
    };

    return ok(analytics);
  } catch (err) {
    console.error("[admin/analytics] GET", err);
    return serverError();
  }
}
