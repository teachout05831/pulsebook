import { NextRequest, NextResponse } from "next/server";
import { getTags } from "@/features/tags/queries/getTags";
import { createTag } from "@/features/tags/actions/createTag";
import type { TagEntityType } from "@/features/tags/types";

export async function GET(request: NextRequest) {
  const entityType = (request.nextUrl.searchParams.get("entityType") || "customer") as TagEntityType;
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const data = await getTags(entityType, from, to);

    const tags = data.map((row) => ({
      id: row.id,
      companyId: row.company_id,
      name: row.name,
      color: row.color,
      source: row.source,
      externalId: row.external_id,
      entityType: row.entity_type,
      createdAt: row.created_at,
    }));

    return NextResponse.json(
      { data: tags, page, limit },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch tags";
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await createTag({
    name: body.name,
    color: body.color,
    entityType: body.entityType || "customer",
  });

  if (result.error) {
    const status = result.error === "Not authenticated" ? 401
      : result.error === "No active company" ? 400
      : result.error.includes("already exists") ? 409
      : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  if (!result.data) {
    return NextResponse.json({ error: 'Tag creation failed' }, { status: 500 });
  }

  // snake_case -> camelCase conversion
  const tag = result.data;
  return NextResponse.json({
    data: {
      id: tag.id,
      companyId: tag.company_id,
      name: tag.name,
      color: tag.color,
      source: tag.source,
      externalId: tag.external_id,
      entityType: tag.entity_type,
      createdAt: tag.created_at,
    },
  }, { status: 201 });
}
