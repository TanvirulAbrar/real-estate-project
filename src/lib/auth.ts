import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export type UserRole = "client" | "agent" | "admin";

export interface AppSession {
  user: {
    id: string;
    email: string;
    name: string | null | undefined;
    role: UserRole;
    theme: "light" | "dark";
    is_demo: boolean;
  };
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireSession(_req: Request): Promise<AppSession> {
  const session = await getServerSession(authOptions);
  const user = session?.user as unknown as
    | {
        id?: string;
        email?: string;
        role?: UserRole;
        theme?: "light" | "dark";
        is_demo?: boolean;
        name?: string | null;
      }
    | undefined;

  if (!user?.id || !user?.email || !user?.role || !user?.theme) {
    throw new HttpError(401, "Unauthorized");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      theme: user.theme,
      is_demo: Boolean(user.is_demo),
    },
  };
}

export async function requireRole(
  req: Request,
  roles: UserRole[]
): Promise<AppSession> {
  const session = await requireSession(req);
  if (!roles.includes(session.user.role)) {
    throw new HttpError(403, "Forbidden");
  }
  return session;
}

