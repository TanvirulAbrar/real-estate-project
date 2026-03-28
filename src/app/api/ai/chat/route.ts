import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
});

async function generateAIResponse(
  userMessage: string,
  userId: string,
): Promise<string> {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("under") ||
    lowerMessage.includes("below") ||
    lowerMessage.includes("less than")
  ) {
    const priceMatch = userMessage.match(/\$?(\d+,?\d*)/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1].replace(",", ""));
      return `I'll help you find properties under $${price.toLocaleString()}. Let me search our database for properties in that price range. You can use our advanced search filters to find exactly what you're looking for.`;
    }
  }

  if (
    lowerMessage.includes("dhaka") ||
    lowerMessage.includes("city") ||
    lowerMessage.includes("area")
  ) {
    return `I can help you find properties in Dhaka! We have many options available including apartments, houses, and commercial properties. Would you like me to show you properties in a specific area of Dhaka?`;
  }

  if (
    lowerMessage.includes("house") ||
    lowerMessage.includes("apartment") ||
    lowerMessage.includes("condo")
  ) {
    return `Great! I can help you find the perfect ${lowerMessage.includes("house") ? "house" : lowerMessage.includes("apartment") ? "apartment" : "condo"}. Let me search for available options that match your criteria.`;
  }

  return `I'd be happy to help you find your dream property! I can assist with finding properties based on location, price range, property type, and specific features. Try asking me something like "Find me a house under $500,000 in Dhaka" or "Show me apartments with 3 bedrooms". What are you looking for?`;
}

export async function POST(req: Request) {
  try {
    const session = await requireSession(req);

    const body = await parseBody(req, chatSchema);
    if (body instanceof Response) return body;

    const aiResponse = await generateAIResponse(body.message, session.user.id);

    await prisma.$queryRaw`
      INSERT INTO ai_chat_logs (user_id, user_message, ai_response, created_at)
      VALUES (${session.user.id}, ${body.message}, ${aiResponse}, NOW())
    `;

    return ok({
      user_message: body.message,
      ai_response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ai/chat] POST", err);
    return serverError();
  }
}
