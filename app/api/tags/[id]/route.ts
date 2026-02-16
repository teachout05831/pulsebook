import { NextRequest, NextResponse } from "next/server";
import { updateTag } from "@/features/tags/actions/updateTag";
import { deleteTag } from "@/features/tags/actions/deleteTag";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const result = await updateTag(id, {
    name: body.name,
    color: body.color,
  });

  if (result.error) {
    const status = result.error === "Not authenticated" ? 401
      : result.error === "No active company" ? 400
      : result.error === "Not authorized" ? 403
      : result.error === "Tag not found" ? 404
      : result.error.includes("already exists") ? 409
      : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const result = await deleteTag(id);

  if (result.error) {
    const status = result.error === "Not authenticated" ? 401
      : result.error === "No active company" ? 400
      : result.error === "Not authorized" ? 403
      : result.error === "Tag not found" ? 404
      : result.error.includes("external") ? 400
      : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ success: true });
}
