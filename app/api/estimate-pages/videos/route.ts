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

// GET /api/estimate-pages/videos - List company videos
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "";
    const estimateId = searchParams.get("estimateId") || "";

    let query = supabase
      .from("estimate_videos")
      .select(VIDEO_FIELDS)
      .eq("company_id", companyId);

    if (category) {
      query = query.eq("category", category);
    }

    if (estimateId) {
      query = query.eq("estimate_id", estimateId);
    }

    query = query
      .order("created_at", { ascending: false })
      .limit(50);

    const { data, error } = await query;

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

// POST /api/estimate-pages/videos - Create video record (after upload to bunny.net)
export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length < 1) {
      return NextResponse.json({ error: "Video title is required" }, { status: 400 });
    }

    if (!body.category || typeof body.category !== "string") {
      return NextResponse.json({ error: "Video category is required" }, { status: 400 });
    }

    const validCategories = ["intro", "testimonial", "process", "site_visit", "before_after", "personal_message", "case_study", "other"];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json({ error: `Invalid category. Must be one of: ${validCategories.join(", ")}` }, { status: 400 });
    }

    if (!body.bunnyVideoId || typeof body.bunnyVideoId !== "string") {
      return NextResponse.json({ error: "Bunny video ID is required" }, { status: 400 });
    }

    if (!body.bunnyLibraryId || typeof body.bunnyLibraryId !== "string") {
      return NextResponse.json({ error: "Bunny library ID is required" }, { status: 400 });
    }

    if (!body.bunnyCdnUrl || typeof body.bunnyCdnUrl !== "string") {
      return NextResponse.json({ error: "Bunny CDN URL is required" }, { status: 400 });
    }

    // If estimate_id provided, verify it belongs to this company
    if (body.estimateId) {
      const { data: estimate } = await supabase
        .from("estimates")
        .select("id")
        .eq("id", body.estimateId)
        .eq("company_id", companyId)
        .single();

      if (!estimate) {
        return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
      }
    }

    const { data, error } = await supabase
      .from("estimate_videos")
      .insert({
        company_id: companyId,
        title: body.title.trim(),
        description: body.description || null,
        category: body.category,
        bunny_video_id: body.bunnyVideoId,
        bunny_library_id: body.bunnyLibraryId,
        bunny_cdn_url: body.bunnyCdnUrl,
        thumbnail_url: body.thumbnailUrl || null,
        duration_seconds: body.durationSeconds || null,
        file_size_bytes: body.fileSizeBytes || null,
        resolution: body.resolution || null,
        is_reusable: body.isReusable !== undefined ? body.isReusable : true,
        estimate_id: body.estimateId || null,
        uploaded_by: user.id,
      })
      .select(VIDEO_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create video record" }, { status: 500 });
    }

    return NextResponse.json({ data: transformVideo(data) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
