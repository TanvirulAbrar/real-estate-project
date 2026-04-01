import { z } from "zod";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { ok, conflict, serverError } from "@/lib/response";
import { parseBody } from "@/lib/validator";
import { IUserLean } from "@/types";

const registerSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    fullName: z.string().min(2).max(100).optional(),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    phone: z.string().max(20).optional().or(z.literal("")),
    role: z.enum(["client", "agent"]).default("client"),
  })
  .refine((data) => !!(data.name?.trim() || data.fullName?.trim()), {
    message: "Name is required",
    path: ["name"],
  });

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await parseBody(req, registerSchema);
    if (body instanceof Response) return body;

    const displayName = (body.name ?? body.fullName ?? "").trim();

    const existingUser = await User.findOne({
      email: body.email,
    }).lean<IUserLean | null>();

    if (existingUser) {
      return conflict("User with this email already exists");
    }

    const hashedPassword = await hash(body.password, 12);
    const phone = body.phone?.trim() || undefined;

    const user = await User.create({
      name: displayName,
      email: body.email,
      password: hashedPassword,
      phone,
      role: body.role || "client",
    });

    const plain = user.toJSON();

    return ok({
      success: true,
      message: "User registered successfully",
      user: {
        id: plain.id,
        name: plain.name,
        email: plain.email,
        role: plain.role,
        created_at: plain.created_at,
      },
    });
  } catch (err) {
    console.error("[auth/register] POST", err);
    return serverError();
  }
}
