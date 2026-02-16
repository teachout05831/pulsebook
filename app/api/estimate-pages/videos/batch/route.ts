import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const VIDEO_FIELDS = "id, company_id, title, description, category, bunny_cdn_url, thumbnail_url, duration_seconds, is_reusable, estimate_id, total_plays, created_at";

function transformVideo(v: Record<string, unknown>) {
  return {
    id: v.id,
    companyId: v.company_id,
    title: v.title,
    description: v.description || null,
    category: v.category,
    bunnyCdnUrl: v.bunny_cdn_url,
    thumbnailUrl: v.thumbnail_url || null,
    durationSeconds: v.duration_seconds || null,
    isReusable: v.is_reusable,
    estimateId: v.estimate_id || null,
    totalPlays: v.total_plays || 0,
    createdAt: v.created_at,
  };
}

const MAX_BATCH_SIZE = 20;

// GET /api/estimate-pages/videos/batch?ids=id1,id2,id3
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const idsParam = request.nextUrl.searchParams.get("ids") || "";
    const ids = idsParam.split(",").filter(Boolean).slice(0, MAX_BATCH_SIZE);

    if (ids.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from("estimate_videos")
      .select(VIDEO_FIELDS)
      .in("id", ids)
      .eq("company_id", companyId)
      .limit(MAX_BATCH_SIZE);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }

    const videos = (data || []).map(transformVideo);

    return NextResponse.json({ data: videos }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
