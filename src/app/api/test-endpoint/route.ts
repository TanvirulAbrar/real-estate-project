export async function GET() {
  return Response.json({ message: "API is working!" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received:", body);
    return Response.json({
      message: "POST working!",
      received: body,
    });
  } catch (error) {
    console.error("Simple POST error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      {
        error: "Simple POST failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
