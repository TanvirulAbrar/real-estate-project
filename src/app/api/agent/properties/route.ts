import { NextRequest, NextResponse } from "next/server";
import { Property, PropertyImage, User } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { requireRole, HttpError, requireSession } from "@/lib/auth";
import { ok, notFound, forbidden, serverError } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole(request, ["agent"]);

    await connectDB();

    const user = await User.findOne({
      email: session.user.email,
      deleted_at: null,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[agent/properties] Fetching properties for agent:", {
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
    });

    const properties = await Property.find({
      $or: [{ agent_id: user._id }, { agent_id: "demo-agent" }],
      deleted_at: null,
    })
      .sort({ created_at: -1 })
      .lean();

    const propertiesWithImages = await Promise.all(
      properties.map(async (p) => {
        const images = await PropertyImage.find({ property_id: p._id })
          .sort({ display_order: 1 })
          .lean();
        return {
          ...p,
          _id: String(p._id),
          agent_id: p.agent_id,
          images: images.map((img) => ({
            id: String(img._id),
            url: img.url,
            is_primary: img.is_primary,
          })),
        };
      }),
    );

    console.log(
      "[agent/properties] Found properties:",
      propertiesWithImages.length,
    );

    return NextResponse.json(propertiesWithImages);
  } catch (error) {
    console.error("Error fetching agent properties:", error);

    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireSession(request);

    await connectDB();

    const url = new URL(request.url);
    const propertyId = url.searchParams.get("id");

    if (!propertyId) {
      return notFound("Property ID required");
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return notFound("Property not found");
    }

    if (
      property.agent_id !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return forbidden("You don't have permission to delete this property");
    }

    property.deleted_at = new Date();
    await property.save();

    return ok({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("[agent/properties] DELETE error:", err);
    return serverError();
  }
}
