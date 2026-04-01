import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AiChatLog, Property } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
});

interface SearchCriteria {
  property_type?: string;
  min_bedrooms?: number;
  max_price?: number;
  city?: string;
}

function parseSearchCriteria(message: string): SearchCriteria {
  const lower = message.toLowerCase();
  const criteria: SearchCriteria = {};

  if (lower.includes("house")) criteria.property_type = "house";
  else if (lower.includes("apartment")) criteria.property_type = "apartment";
  else if (lower.includes("condo")) criteria.property_type = "condo";

  const bedroomMatch =
    message.match(/(\d+)\s*bedroom/i) || message.match(/(\d+)\s*bed/i);
  if (bedroomMatch) {
    criteria.min_bedrooms = parseInt(bedroomMatch[1]);
  }

  const priceMatch = message.match(
    /\$?([\d,]+(?:\.\d+)?)\s*(k|thousand|m|million)?/i,
  );
  if (priceMatch) {
    let price = parseFloat(priceMatch[1].replace(/,/g, ""));
    const suffix = priceMatch[2]?.toLowerCase();
    if (suffix === "k" || suffix === "thousand") price *= 1000;
    if (suffix === "m" || suffix === "million") price *= 1000000;
    criteria.max_price = price;
  }

  const cities = [
    "dhaka",
    "miami",
    "new york",
    "los angeles",
    "chicago",
    "boston",
  ];
  for (const city of cities) {
    if (lower.includes(city)) {
      criteria.city = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  return criteria;
}

async function generateAIResponse(
  userMessage: string,
  _userId: string,
): Promise<{ text: string; properties?: any[] }> {
  const criteria = parseSearchCriteria(userMessage);
  const hasCriteria = Object.keys(criteria).length > 0;

  if (!hasCriteria) {
    return {
      text: `I'd be happy to help you find your dream property! Try asking me something like:

• "Show me apartments with 3 bedrooms under $500,000"
• "Find houses in Miami"
• "3 bedroom condos under 800k"

What are you looking for?`,
    };
  }

  const query: any = { status: "active", deleted_at: { $exists: false } };
  if (criteria.property_type) query.property_type = criteria.property_type;
  if (criteria.min_bedrooms) query.bedrooms = { $gte: criteria.min_bedrooms };
  if (criteria.max_price) query.price = { $lte: criteria.max_price.toString() };
  if (criteria.city) query.city = criteria.city;

  const properties = await Property.find(query).limit(5).lean();

  if (properties.length === 0) {
    let text =
      "I searched our database but couldn't find any properties matching your criteria";
    const filters: string[] = [];
    if (criteria.property_type) filters.push(criteria.property_type + "s");
    if (criteria.min_bedrooms)
      filters.push(`${criteria.min_bedrooms}+ bedrooms`);
    if (criteria.max_price)
      filters.push(`under $${criteria.max_price.toLocaleString()}`);
    if (criteria.city) filters.push(`in ${criteria.city}`);
    if (filters.length > 0) text += " (" + filters.join(", ") + ")";
    text += ". Try adjusting your search or browse all properties.";
    return { text };
  }

  let text = `Great! I found ${properties.length} ${criteria.property_type || "property"}${properties.length > 1 ? "ies" : "y"}`;
  if (criteria.min_bedrooms) text += ` with ${criteria.min_bedrooms}+ bedrooms`;
  if (criteria.max_price)
    text += ` under $${criteria.max_price.toLocaleString()}`;
  if (criteria.city) text += ` in ${criteria.city}`;
  text += ":\n\nClick on any property to view details or make an offer.";

  return {
    text,
    properties: properties.map((p: any) => ({
      id: String(p._id),
      title: p.title,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      city: p.city,
      state: p.state,
      property_type: p.property_type,
    })),
  };
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);

    const body = await parseBody(req, chatSchema);
    if (body instanceof Response) return body;

    const result = await generateAIResponse(body.message, session.user.id);

    await AiChatLog.create({
      user_id: session.user.id,
      user_message: body.message,
      ai_response: result.text,
    });

    return ok({
      user_message: body.message,
      ai_response: result.text,
      properties: result.properties,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ai/chat] POST", err);
    return serverError();
  }
}
