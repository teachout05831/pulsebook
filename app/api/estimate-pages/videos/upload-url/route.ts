import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { createHash } from "crypto";

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_DEFAULT_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID || "";

// POST /api/estimate-pages/videos/upload-url - Generate a signed upload URL for bunny.net
export async function POST(request: NextRequest) {
  try {
    await getAuthCompany();

    if (!BUNNY_API_KEY) {
      return NextResponse.json({ error: "Video uploads not configured. Set BUNNY_API_KEY." }, { status: 503 });
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim().length < 1) {
      return NextResponse.json({ error: "Video title is required" }, { status: 400 });
    }

    const libraryId = body.libraryId || BUNNY_DEFAULT_LIBRARY_ID;

    if (!libraryId) {
      return NextResponse.json({ error: "No video library configured. Set BUNNY_LIBRARY_ID or provide libraryId." }, { status: 400 });
    }

    // Step 1: Create video in bunny.net library
    const createResponse = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      {
        method: "POST",
        headers: {
          "AccessKey": BUNNY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: body.title.trim(),
        }),
      }
    );

    if (!createResponse.ok) {
      return NextResponse.json({ error: "Failed to create video on bunny.net" }, { status: 502 });
    }

    const videoData = await createResponse.json();

    // Step 2: Generate signed auth for browser-direct upload
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoData.guid}`;
    const authExpire = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const authSignature = createHash("sha256")
      .update(libraryId + BUNNY_API_KEY + String(authExpire) + videoData.guid)
      .digest("hex");

    return NextResponse.json({
      data: {
        uploadUrl,
        videoId: videoData.guid,
        libraryId,
        authSignature,
        authExpire,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to connect to video service" }, { status: 502 });
  }
}
