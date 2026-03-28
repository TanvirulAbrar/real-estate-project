import { z } from "zod";
import { parseBody } from "@/lib/validator";
import { ok, badRequest, serverError } from "@/lib/response";

const schema = z.object({
  role: z.enum(["client", "agent", "admin"]),
});

// Demo user credentials
const demoUsers = {
  client: {
    email: "user@example.com",
    password: "123456",
    name: "Demo User",
    role: "client" as const,
  },
  agent: {
    email: "agent@example.com",
    password: "123456",
    name: "Demo Agent",
    role: "agent" as const,
  },
  admin: {
    email: "admin@example.com",
    password: "123456",
    name: "Demo Admin",
    role: "admin" as const,
  },
};

export async function POST(req: Request) {
  try {
    const body = await parseBody(req, schema);
    if (body instanceof Response) return body;

    const demoUser = demoUsers[body.role];
    if (!demoUser) {
      return badRequest("Invalid role specified");
    }

    return ok({
      message: `Demo credentials for ${body.role}`,
      user: {
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        is_demo: true,
      },
      credentials: {
        email: demoUser.email,
        password: demoUser.password,
      },
      instructions: {
        step1: "Use these credentials with the regular login form",
        step2:
          "Frontend should auto-fill the login form with these credentials",
        step3: "Then call the standard NextAuth signin endpoint",
      },
    });
  } catch (err) {
    console.error("[auth/demo-login] POST", err);
    return serverError();
  }
}
