import OpenAI from "openai";
import type { UserRole } from "@/lib/auth";

export interface PropertyDescriptionAttrs {
  property_type: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  city: string;
  state: string;
  features?: string[];
}

export interface PropertyCardShape {
  id: string;
  title: string;
  description: string | null;
  price: number;
  city: string;
  state: string;
  primary_image_url: string | null;
  property_type: string;
  listing_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  average_rating: number | null;
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function generatePropertyDescription(
  attrs: PropertyDescriptionAttrs,
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("OPENAI_API_KEY missing");

  const prompt = [
    "You are a professional real estate copywriter. Write compelling, accurate property descriptions.",
    "",
    `User: Write a property description for:`,
    `- Type: ${attrs.property_type}`,
    `- Bedrooms: ${attrs.bedrooms ?? "n/a"}`,
    `- Bathrooms: ${attrs.bathrooms ?? "n/a"}`,
    `- Area: ${attrs.area_sqft ?? "n/a"} sq ft`,
    `- Location: ${attrs.city}, ${attrs.state}`,
    `- Features: ${(attrs.features ?? []).join(", ") || "n/a"}`,
    "",
    "Keep it under 200 words. Focus on lifestyle benefits.",
  ].join("\n");

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });

  const content = resp.choices?.[0]?.message?.content?.trim();
  return content || "";
}

export async function summarizeReviews(
  reviews: { rating: number; comment: string }[],
): Promise<string> {
  const client = getClient();
  if (!client) throw new Error("OPENAI_API_KEY missing");

  const avg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;

  const reviewsJson = JSON.stringify(
    reviews.map((r) => ({ rating: r.rating, comment: r.comment })),
    null,
    0,
  );

  const prompt = `Summarize these ${reviews.length} reviews (average rating: ${avg}/5):\n${reviewsJson}\n\nProvide a 2-3 sentence neutral summary highlighting common themes.`;

  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return resp.choices?.[0]?.message?.content?.trim() || "";
}

export async function recommendProperties(
  _preferences: unknown,
  _candidates: PropertyCardShape[],
): Promise<PropertyCardShape[]> {
  throw new Error("AI recommendation not implemented yet");
}
