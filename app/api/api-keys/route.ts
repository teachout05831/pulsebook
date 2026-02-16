import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getApiKeys } from "@/features/api-keys/queries/getApiKeys";
import { createApiKey } from "@/features/api-keys/actions/createApiKey";

export async function GET() {
  try {
    const data = await getApiKeys();

    const apiKeys = data.map((k) => ({
      id: k.id,
      name: k.name,
      keyPrefix: k.key_prefix,
      lastUsedAt: k.last_used_at,
      expiresAt: k.expires_at,
      isActive: k.is_active,
      createdAt: k.created_at,
    }));

    return NextResponse.json({ data: apiKeys }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch API keys";
    if (message === "Not authenticated") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await createApiKey({
    name: body.name,
    expiresAt: body.expiresAt,
  });

  if (result.error) {
    const status = result.error === "Not authenticated" ? 401 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ data: result.data }, { status: 201 });
}
