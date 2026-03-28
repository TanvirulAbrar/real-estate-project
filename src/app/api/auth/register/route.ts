import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, ok, conflict, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { hash } from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().max(20).optional(),
  role: z.enum(["client", "agent"]).default("client"),
});

export async function POST(req: Request) {
  try {
    const body = await parseBody(req, registerSchema);
    if (body instanceof Response) return body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }],
      },
    });

    if (existingUser) {
      return conflict("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hash(body.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone || null,
        role: body.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    return ok({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("[auth/register] POST", err);
    return serverError();
  }
}
