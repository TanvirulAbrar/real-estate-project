import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Testing database connection...");
    await connectDB();
    console.log("Database connected successfully!");

    return Response.json({
      message: "Database connection working!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      {
        error: "Database connection failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
