import { notImplemented } from "@/lib/response";

function routeName(path: string[] | undefined) {
  return `/api/${(path ?? []).join("/")}`;
}

type PathParams = { path?: string[] };
type HandlerContext = { params: Promise<PathParams> };

export async function GET(_req: Request, context: HandlerContext) {
  const params = await context.params;
  return notImplemented(`GET ${routeName(params.path)} is not implemented yet`);
}

export async function POST(_req: Request, context: HandlerContext) {
  const params = await context.params;
  return notImplemented(
    `POST ${routeName(params.path)} is not implemented yet`
  );
}

export async function PUT(_req: Request, context: HandlerContext) {
  const params = await context.params;
  return notImplemented(`PUT ${routeName(params.path)} is not implemented yet`);
}

export async function DELETE(_req: Request, context: HandlerContext) {
  const params = await context.params;
  return notImplemented(`DELETE ${routeName(params.path)} is not implemented yet`);
}

