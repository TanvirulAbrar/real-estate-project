import type { ZodSchema } from "zod";
import { z } from "zod";
import { badRequest } from "@/lib/response";

export async function parseBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<T | Response> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return badRequest("Validation failed", parsed.error.flatten());
  }
  return parsed.data;
}

export function parseQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): T | Response {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return badRequest("Invalid query parameters", parsed.error.flatten());
  }
  return parsed.data;
}

export function parseUUIDParam(
  value: string | undefined,
  paramName = "id"
): string | Response {
  if (!value) return badRequest(`Missing ${paramName}`);
  const parsed = z.string().uuid().safeParse(value);
  if (!parsed.success) {
    return badRequest(`Invalid ${paramName} (expected UUID)`);
  }
  return parsed.data;
}

