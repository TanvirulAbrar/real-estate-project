import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property } from "@/lib/models";
import { requireSession } from "@/lib/auth";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1, "State is required"),
  property_type: z.enum([
    "house",
    "apartment",
    "condo",
    "townhouse",
    "land",
    "commercial",
    "other",
  ]),
  listing_type: z.enum(["sale", "rent"]),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().positive().optional(),
  area_sqft: z.number().positive().optional(),
  status: z
    .enum(["active", "pending", "sold", "rented", "inactive"])
    .optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const total = await Property.countDocuments({
      deleted_at: null,
      status: "active",
    });

    const properties = await Property.find({
      deleted_at: null,
      status: "active",
    })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const { PropertyImage } = await import("@/lib/models");
    const propertiesWithImages = await Promise.all(
      properties.map(async (prop) => {
        const images = await PropertyImage.find({
          property_id: String(prop._id),
        })
          .select("url is_primary")
          .lean();
        return {
          ...prop.toObject(),
          id: String(prop._id),
          images: images.map((img) => ({
            id: String(img._id),
            url: img.url,
            is_primary: img.is_primary,
          })),
        };
      }),
    );

    return Response.json({
      data: propertiesWithImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    console.log("Request body:", raw);

    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      console.log("Validation errors:", parsed.error.flatten());
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body = parsed.data;
    console.log("Validated body:", body);

    await connectDB();

    const session = await requireSession(req);

    const property = new Property({
      ...body,
      agent_id: session.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await property.save();

    const propertyObj = property.toObject();

    return Response.json(
      {
        ...propertyObj,
        message: "Property created successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
