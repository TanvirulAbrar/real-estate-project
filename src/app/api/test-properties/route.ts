import { NextRequest, NextResponse } from "next/server";
import { Property, User } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const agent = await User.findOne({
      email: "agent@example.com",
      deleted_at: null,
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const properties = await Property.find({
      agent: agent._id,
      deleted_at: null,
    }).sort({ created_at: -1 });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching test properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
