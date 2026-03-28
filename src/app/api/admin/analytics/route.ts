import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";

const querySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await requireRole(req, ["admin"]);

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
      totalRevenue,
      activeListings,
      pendingOffers,
      totalInquiries,
      totalAppointments,
    ] = await Promise.all([
      prisma.user.count({ where: { deleted_at: null } }),
      prisma.property.count({ where: { deleted_at: null } }),
      prisma.transaction.count({ where: { status: "closed" } }),
      prisma.transaction.aggregate({
        where: { status: "closed" },
        _sum: { sale_price: true },
      }),
      prisma.property.count({ where: { deleted_at: null, status: "active" } }),
      prisma.offer.count({ where: { deleted_at: null, status: "pending" } }),
      prisma.inquiry.count({ where: { deleted_at: null } }),
      prisma.appointment.count({ where: { deleted_at: null } }),
    ]);

    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*)::int as properties_count,
        COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0)::int as active_properties
      FROM properties 
      WHERE deleted_at IS NULL 
        AND created_at >= ${startDate}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `;

    const monthlySales = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*)::int as sales_count,
        COALESCE(SUM(sale_price), 0) as revenue
      FROM transactions 
      WHERE status = 'closed' 
        AND created_at >= ${startDate}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `;

    const monthlyUsers = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*)::int as users_count,
        COALESCE(SUM(CASE WHEN role = 'agent' THEN 1 ELSE 0 END), 0)::int as agents_count
      FROM users 
      WHERE deleted_at IS NULL 
        AND created_at >= ${startDate}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `;

    const topAgents = await prisma.user.findMany({
      where: { role: "agent", deleted_at: null },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            properties: { where: { deleted_at: null } },
            transactions: { where: { status: "closed" } },
          },
        },
      },
      orderBy: {
        transactions: {
          _count: "desc",
        },
      },
      take: 10,
    });

    const propertyTypes = await prisma.property.groupBy({
      by: ["property_type"],
      where: { deleted_at: null },
      _count: { property_type: true },
    });

    const recentActivity = await Promise.all([
      prisma.property.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: "desc" },
        take: 5,
        select: { id: true, title: true, created_at: true },
      }),
      prisma.inquiry.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: "desc" },
        take: 5,
        select: { id: true, message: true, created_at: true },
      }),
      prisma.offer.findMany({
        where: { deleted_at: null },
        orderBy: { created_at: "desc" },
        take: 5,
        select: { id: true, amount: true, created_at: true },
      }),
    ]);

    const analytics = {
      overview: {
        total_users: totalUsers,
        total_properties: totalProperties,
        total_sales: totalSales,
        total_revenue: totalRevenue._sum.sale_price || 0,
        active_listings: activeListings,
        pending_offers: pendingOffers,
        total_inquiries: totalInquiries,
        total_appointments: totalAppointments,
      },
      monthly_stats: {
        properties: monthlyStats,
        sales: monthlySales,
        users: monthlyUsers,
      },
      top_agents: topAgents.map((agent) => ({
        ...agent,
        properties_count: agent._count.properties,
        sales_count: agent._count.transactions,
      })),
      property_types: propertyTypes.map((type) => ({
        type: type.property_type,
        count: type._count.property_type,
      })),
      recent_activity: {
        properties: recentActivity[0],
        inquiries: recentActivity[1],
        offers: recentActivity[2],
      },
    };

    return ok(analytics);
  } catch (err) {
    console.error("[admin/analytics] GET", err);
    return serverError();
  }
}
