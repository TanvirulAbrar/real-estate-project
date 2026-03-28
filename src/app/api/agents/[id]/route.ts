import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, serverError, forbidden } from "@/lib/response";

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

export async function GET(req: Request, context: HandlerContext) {
  try {
    await requireSession(req);

    const params = await context.params;
    const agent = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar_url: true,
        bio: true,
        role: true,
        theme: true,
        is_demo: true,
        deleted_at: true,
      },
    });

    if (!agent || agent.deleted_at) {
      return new Response(JSON.stringify({ message: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [activeListingsCount, avg] = await Promise.all([
      prisma.property.count({
        where: { agent_id: agent.id, deleted_at: null, status: "active" },
      }),
      prisma.review.aggregate({
        where: { target_type: "agent", target_id: agent.id },
        _avg: { rating: true },
      }),
    ]);

    return ok({
      id: agent.id,
      email: agent.email,
      name: agent.name,
      phone: agent.phone,
      avatar_url: agent.avatar_url,
      bio: agent.bio,
      role: agent.role,
      theme: agent.theme,
      is_demo: agent.is_demo,
      active_listings_count: activeListingsCount,
      average_review_rating: avg._avg.rating ? Number(avg._avg.rating) : null,
    });
  } catch (err) {
    console.error("[agents/[id]] GET", err);
    return serverError();
  }
}

export async function DELETE(req: Request, context: HandlerContext) {
  try {
    const session = await requireRole(req, ["admin"]);
    void session;

    const params = await context.params;
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user || user.deleted_at) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.role !== "agent" && user.role !== "admin") {
      return forbidden("User is not an agent");
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role: "client" },
      select: { id: true, email: true, role: true },
    });

    return ok(updated);
  } catch (err) {
    console.error("[agents/[id]] DELETE", err);
    return serverError();
  }
}

