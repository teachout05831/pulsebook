import { NextRequest, NextResponse } from "next/server";
import { getUniversalBlocks } from "@/features/universal-blocks/queries/getUniversalBlocks";
import { createUniversalBlock } from "@/features/universal-blocks/actions/createUniversalBlock";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const blocks = await getUniversalBlocks(from, to);

    const data = blocks.map((b) => ({
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
    }));

    return NextResponse.json({ data, page, limit }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blocks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createUniversalBlock({
      name: body.name,
      description: body.description || null,
      category: body.category || null,
      section_type: body.sectionType,
      settings: body.settings || {},
      content: body.content || {},
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

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
    return NextResponse.json({ error: "Failed to create block" }, { status: 500 });
  }
}
