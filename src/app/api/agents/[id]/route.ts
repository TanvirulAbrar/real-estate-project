import { connectDB } from "@/lib/mongodb";
import { User, Property, Review } from "@/lib/models";
import { requireRole, requireSession } from "@/lib/auth";
import { ok, serverError, forbidden } from "@/lib/response";
import { IUserLean, IPropertyLean, IReviewLean } from "@/types";

type Params = { id: string };
type HandlerContext = { params: Promise<Params> };

interface UpdatedUser {
  _id: any;
  email: string;
  role: string;
}

export async function GET(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    await requireSession(req);

    const params = await context.params;
    const agent = await User.findById(params.id)
      .select("email name phone avatar_url bio role theme is_demo deleted_at")
      .lean<IUserLean | null>();

    if (!agent || agent.deleted_at) {
      return new Response(JSON.stringify({ message: "Agent not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = String(agent._id);

    const [activeListingsCount, avgAgg] = await Promise.all([
      Property.countDocuments({
        agent_id: id,
        deleted_at: null,
        status: "active",
      }),
      Review.aggregate([
        { $match: { target_type: "agent", target_id: id } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
    ]);

    const avgRating = avgAgg[0]?.avg;

    return ok({
      id,
      email: agent.email,
      name: agent.name,
      phone: agent.phone,
      avatar_url: agent.avatar_url,
      bio: agent.bio,
      role: agent.role,
      theme: agent.theme,
      is_demo: agent.is_demo,
      active_listings_count: activeListingsCount,
      average_review_rating: avgRating != null ? Number(avgRating) : null,
    });
  } catch (err) {
    console.error("[agents/[id]] GET", err);
    return serverError();
  }
}

export async function DELETE(req: Request, context: HandlerContext) {
  try {
    await connectDB();
    const session = await requireRole(req, ["admin"]);
    void session;

    const params = await context.params;
    const user = await User.findById(params.id)
      .select("deleted_at role")
      .lean<IUserLean | null>();
    if (!user || user.deleted_at) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.role !== "agent" && user.role !== "admin") {
      return forbidden("User is not an agent");
    }

    const updated = await User.findByIdAndUpdate(
      params.id,
      { role: "client" },
      { new: true, select: "email role" },
    ).lean<IUserLean | null>();

    if (!updated) return serverError();

    return ok({
      id: String(updated._id),
      email: updated.email,
      role: updated.role,
    });
  } catch (err) {
    console.error("[agents/[id]] DELETE", err);
    return serverError();
  }
}
