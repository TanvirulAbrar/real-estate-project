import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };

    return NextResponse.json({
      message: "Debug info",
      environment: envVars,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug error", details: error },
      { status: 500 }
    );
  }
}
