import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: "Simple test works!",
      timestamp: new Date().toISOString(),
      status: "success"
    });

  } catch (error) {
    console.error("Simple test error:", error);
    return NextResponse.json(
      { error: "Simple test failed", details: error },
      { status: 500 }
    );
  }
}
