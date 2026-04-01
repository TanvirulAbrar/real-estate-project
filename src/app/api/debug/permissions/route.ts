import { requireRole } from "@/lib/auth";
import { HttpError } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const results = {
      clientAccess: "unknown",
      agentAccess: "unknown",
      adminAccess: "unknown",
    };

    try {
      await requireRole(new Request("http://localhost:3000"), ["client"]);
      results.clientAccess = "granted";
    } catch (error) {
      if (error instanceof HttpError && error.status === 403) {
        results.clientAccess = "denied";
      } else {
        results.clientAccess = "error";
      }
    }

    try {
      await requireRole(new Request("http://localhost:3000"), ["agent"]);
      results.agentAccess = "granted";
    } catch (error) {
      if (error instanceof HttpError && error.status === 403) {
        results.agentAccess = "denied";
      } else {
        results.agentAccess = "error";
      }
    }

    try {
      await requireRole(new Request("http://localhost:3000"), ["admin"]);
      results.adminAccess = "granted";
    } catch (error) {
      if (error instanceof HttpError && error.status === 403) {
        results.adminAccess = "denied";
      } else {
        results.adminAccess = "error";
      }
    }

    return Response.json(results);
  } catch (error) {
    return Response.json({
      error: "Failed to check permissions",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
