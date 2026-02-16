import { NextResponse } from "next/server";
import { getUniversalBlockById } from "@/features/universal-blocks/queries/getUniversalBlocks";
import { updateUniversalBlock } from "@/features/universal-blocks/actions/updateUniversalBlock";
import { deleteUniversalBlock } from "@/features/universal-blocks/actions/deleteUniversalBlock";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const b = await getUniversalBlockById(id);

    return NextResponse.json({
      data: {
        id: b.id,
        companyId: b.company_id,
        name: b.name,
        description: b.description,
        category: b.category,
        sectionType: b.section_type,
        settings: b.settings || {},
        content: b.content || {},
        usageCount: b.usage_count,
        createdBy: b.created_by,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch block" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const input: Record<string, unknown> = {};
    if (body.name !== undefined) input.name = body.name;
    if (body.description !== undefined) input.description = body.description;
    if (body.category !== undefined) input.category = body.category;
    if (body.settings !== undefined) input.settings = body.settings;
    if (body.content !== undefined) input.content = body.content;
    if (body.usageCount !== undefined) input.usage_count = body.usageCount;

    const result = await updateUniversalBlock(id, input);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    const b = result.data!;
    return NextResponse.json({
      data: {
        id: b.id,
        companyId: b.company_id,
        name: b.name,
        description: b.description,
        category: b.category,
        sectionType: b.section_type,
        settings: b.settings || {},
        content: b.content || {},
        usageCount: b.usage_count,
        createdBy: b.created_by,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update block" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await deleteUniversalBlock(id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete block" }, { status: 500 });
  }
}
