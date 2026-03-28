export const jsonHeaders = {
  "Content-Type": "application/json",
};

export const ok = (data: unknown) =>
  Response.json(data, { status: 200, headers: jsonHeaders });

export const created = (data: unknown) =>
  Response.json(data, { status: 201, headers: jsonHeaders });

export const badRequest = (message: string, details?: unknown) =>
  Response.json({ message, details }, { status: 400, headers: jsonHeaders });

export const notFound = (message = "Not found") =>
  Response.json({ message }, { status: 404, headers: jsonHeaders });

export const forbidden = (message = "Forbidden") =>
  Response.json({ message }, { status: 403, headers: jsonHeaders });

export const conflict = (message: string) =>
  Response.json({ message }, { status: 409, headers: jsonHeaders });

export const unprocessable = (message: string) =>
  Response.json({ message }, { status: 422, headers: jsonHeaders });

export const serverError = (message = "Internal server error") =>
  Response.json({ message }, { status: 500, headers: jsonHeaders });

export const notImplemented = (message = "Not implemented") =>
  Response.json({ message }, { status: 501, headers: jsonHeaders });

