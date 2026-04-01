import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { IUserLean } from "@/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({
        error: "No session found",
        session: null,
      });
    }

    let dbUser = null;
    try {
      await connectDB();
      dbUser = await User.findById(session.user?.id).lean<IUserLean | null>();
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return Response.json({
      session: {
        user: session.user,
        expires: session.expires,
      },
      dbUser: dbUser
        ? {
            id: String(dbUser._id),
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            is_demo: dbUser.is_demo,
          }
        : null,
      canCreateProperty:
        session.user?.role === "agent" || session.user?.role === "admin",
    });
  } catch (error) {
    return Response.json({
      error: "Failed to get session",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
