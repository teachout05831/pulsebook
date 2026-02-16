import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const VIDEO_FIELDS = "id, company_id, title, description, category, bunny_video_id, bunny_library_id, bunny_cdn_url, thumbnail_url, duration_seconds, file_size_bytes, resolution, is_reusable, estimate_id, total_plays, avg_watch_percentage, uploaded_by, created_at";

function transformVideo(v: Record<string, unknown>) {
  return {
    id: v.id,
    companyId: v.company_id,
    title: v.title,
    description: v.description || null,
    category: v.category,
    bunnyVideoId: v.bunny_video_id,
    bunnyLibraryId: v.bunny_library_id,
    bunnyCdnUrl: v.bunny_cdn_url,
    thumbnailUrl: v.thumbnail_url || null,
    durationSeconds: v.duration_seconds || null,
    fileSizeBytes: v.file_size_bytes || null,
    resolution: v.resolution || null,
    isReusable: v.is_reusable,
    estimateId: v.estimate_id || null,
    totalPlays: v.total_plays || 0,
    avgWatchPercentage: v.avg_watch_percentage || 0,
    uploadedBy: v.uploaded_by || null,
    createdAt: v.created_at,
  };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/estimate-pages/videos/[id] - Get single video
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("estimate_videos")
      .select(VIDEO_FIELDS)
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ data: transformVideo(data) }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/estimate-pages/videos/[id] - Delete video record
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Ownership check
    const { data: existing } = await supabase
      .from("estimate_videos")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Delete DB record only -- actual bunny.net deletion handled separately
    const { error } = await supabase
      .from("estimate_videos")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
