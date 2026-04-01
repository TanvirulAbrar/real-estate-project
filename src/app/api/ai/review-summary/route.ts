import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Property, Review } from "@/lib/models";
import { requireSession } from "@/lib/auth";
import { ok, serverError, notFound } from "@/lib/response";
import { parseQuery } from "@/lib/validator";
import { IReviewLean, IPropertyLean } from "@/types";

const querySchema = z.object({
  property_id: z.string().min(1),
});

function generateReviewSummary(
  reviews: { rating: number; comment?: string | null }[],
): {
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  key_points: string[];
  average_rating: number;
} {
  if (reviews.length === 0) {
    return {
      summary: "No reviews available for this property yet.",
      sentiment: "neutral",
      key_points: [],
      average_rating: 0,
    };
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (averageRating >= 4) sentiment = "positive";
  else if (averageRating <= 2) sentiment = "negative";

  const allComments = reviews.map((r) => r.comment).filter(Boolean) as string[];
  const keyPoints: string[] = [];

  const commonKeywords = [
    "location",
    "price",
    "clean",
    "spacious",
    "modern",
    "quiet",
    "safe",
    "convenient",
  ];

  commonKeywords.forEach((keyword) => {
    const mentions = allComments.filter((comment) =>
      comment.toLowerCase().includes(keyword),
    ).length;

    if (mentions > 0) {
      keyPoints.push(
        `${keyword} mentioned in ${mentions} review${mentions > 1 ? "s" : ""}`,
      );
    }
  });

  let summary = `This property has received ${reviews.length} review${reviews.length > 1 ? "s" : ""} `;
  summary += `with an average rating of ${averageRating.toFixed(1)} out of 5. `;

  if (sentiment === "positive") {
    summary += `Overall, guests have had positive experiences with this property. `;
  } else if (sentiment === "negative") {
    summary += `Based on the reviews, there are some areas that could be improved. `;
  } else {
    summary += `Reviews for this property are mixed. `;
  }

  if (keyPoints.length > 0) {
    summary += `Key aspects mentioned by reviewers include: ${keyPoints.slice(0, 3).join(", ")}.`;
  }

  return {
    summary,
    sentiment,
    key_points: keyPoints,
    average_rating: Math.round(averageRating * 10) / 10,
  };
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await requireSession(req);
    void session;

    const url = new URL(req.url);
    const query = parseQuery(url.searchParams, querySchema);
    if (query instanceof Response) return query;

    const property = await Property.findOne({
      _id: query.property_id,
      deleted_at: null,
    })
      .select("title")
      .lean<IPropertyLean | null>();

    if (!property) {
      return notFound("Property not found");
    }

    const reviews = await Review.find({
      target_type: "property",
      target_id: query.property_id,
    })
      .sort({ created_at: -1 })
      .lean<IReviewLean[]>();

    const summary = generateReviewSummary(reviews);

    return ok({
      property_id: query.property_id,
      property_title: property.title,
      total_reviews: reviews.length,
      ...summary,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ai/review-summary] GET", err);
    return serverError();
  }
}
