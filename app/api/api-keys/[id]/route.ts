import { NextRequest, NextResponse } from "next/server";
import { updateApiKey } from "@/features/api-keys/actions/updateApiKey";
import { deleteApiKey } from "@/features/api-keys/actions/deleteApiKey";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const result = await updateApiKey(id, { name: body.name });

  if (result.error) {
    const status = result.error === "Not authenticated" ? 401
      : result.error === "Not authorized" ? 403
      : result.error === "API key not found" ? 404
      : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ data: { success: true } });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const result = await deleteApiKey(id);

  if (result.error) {
    const status = result.error === "Not authenticated" ? 401
      : result.error === "Not authorized" ? 403
      : result.error === "API key not found" ? 404
      : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ data: { success: true } });
}
