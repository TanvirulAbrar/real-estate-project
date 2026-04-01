import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AiDescriptionLog } from "@/lib/models";
import { requireRole } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const generateSchema = z.object({
  property_type: z.enum([
    "house",
    "apartment",
    "condo",
    "townhouse",
    "land",
    "commercial",
    "other",
  ]),
  bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  bathrooms: z.coerce.number().min(0).max(10).optional(),
  area_sqft: z.coerce.number().min(0).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive()),
  features: z.array(z.string()).max(20).optional(),
});

function generatePropertyDescription(data: {
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  city: string;
  state: string;
  price: number;
  features?: string[];
}): string {
  const {
    property_type,
    bedrooms,
    bathrooms,
    area_sqft,
    city,
    state,
    price,
    features,
  } = data;

  let description = `Discover this stunning ${property_type} located in the heart of ${city}, ${state}. `;

  if (bedrooms && bathrooms) {
    description += `This beautiful property features ${bedrooms} spacious ${bedrooms === 1 ? "bedroom" : "bedrooms"} and ${bathrooms} modern ${bathrooms === 1 ? "bathroom" : "bathrooms"}. `;
  }

  if (area_sqft) {
    description += `With ${area_sqft.toLocaleString()} square feet of living space, `;
  }

  description += `this home offers ample room for comfortable living and entertaining. `;

  if (features && features.length > 0) {
    description += `Notable features include ${features.slice(0, 3).join(", ")}`;
    if (features.length > 3) {
      description += ` and much more.`;
    } else {
      description += `.`;
    }
  }

  description += ` Priced at $${price.toLocaleString()}, this property represents excellent value in today's market. `;

  description += `Don't miss the opportunity to make this wonderful ${property_type} your new home. Contact us today to schedule a viewing!`;

  return description;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireRole(req, ["agent", "admin"]);

    const body = await parseBody(req, generateSchema);
    if (body instanceof Response) return body;

    const description = generatePropertyDescription(body);

    await AiDescriptionLog.create({
      user_id: session.user.id,
      property_data: body,
      generated_description: description,
    });

    return ok({
      description,
      generated_at: new Date().toISOString(),
      input_data: body,
    });
  } catch (err) {
    console.error("[ai/generate-description] POST", err);
    return serverError();
  }
}
