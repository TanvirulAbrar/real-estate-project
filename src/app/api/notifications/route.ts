import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/response";
import { parseQuery } from "@/lib/validator";

const querySchema = z.object({
  unread_only: z.coerce.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await requireSession(req);
    const url = new URL(req.url);
    const q = parseQuery(url.searchParams, querySchema);
    if (q instanceof Response) return q;

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: session.user.id,
        ...(q.unread_only ? { is_read: false } : {}),
      },
      orderBy: { created_at: "desc" },
    });

    return ok(notifications);
  } catch (err) {
    console.error("[notifications] GET", err);
    return serverError();
  }
}

