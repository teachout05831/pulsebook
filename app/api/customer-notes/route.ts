import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const NOTE_FIELDS = "id, company_id, customer_id, content, is_pinned, created_by, created_at, updated_at, users:created_by(full_name, email)";

function convertNote(note: Record<string, unknown>) {
  const author = note.users as { full_name?: string; email?: string } | null;
  const authorName = author?.full_name || author?.email || "Unknown";
  return {
    id: note.id,
    companyId: note.company_id,
    customerId: note.customer_id,
    content: note.content,
    isPinned: note.is_pinned,
    createdBy: note.created_by,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
    authorName,
    authorInitials: authorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();
    const customerId = request.nextUrl.searchParams.get("customerId");
    if (!customerId) {
      return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("customer_notes")
      .select(NOTE_FIELDS)
      .eq("customer_id", customerId)
      .eq("company_id", companyId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Notes list error:", error.message);
      return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }

    return NextResponse.json(
      { data: (data || []).map((n) => convertNote(n as Record<string, unknown>)) },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, companyId } = await getAuthCompany();
    const body = await request.json();

    if (!body.customerId) return NextResponse.json({ error: "customerId is required" }, { status: 400 });
    if (!body.content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });
    if (body.content.length > 10000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

    const { data, error } = await supabase
      .from("customer_notes")
      .insert({
        company_id: companyId,
        customer_id: body.customerId,
        content: body.content.trim(),
        is_pinned: body.isPinned || false,
        created_by: user.id,
      })
      .select(NOTE_FIELDS)
      .single();

    if (error) {
      console.error("Create note error:", error.message);
      return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }

    return NextResponse.json({ data: convertNote(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();
    const body = await request.json();

    if (!body.noteId) return NextResponse.json({ error: "noteId is required" }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (body.content !== undefined) {
      if (!body.content.trim()) return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
      if (body.content.length > 10000) return NextResponse.json({ error: "Content too long" }, { status: 400 });
      updateData.content = body.content.trim();
    }
    if (body.isPinned !== undefined) updateData.is_pinned = body.isPinned;
    if (Object.keys(updateData).length === 0) return NextResponse.json({ error: "No updates provided" }, { status: 400 });

    // Ownership check
    const { data: existing } = await supabase
      .from("customer_notes")
      .select("company_id")
      .eq("id", body.noteId)
      .single();
    if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { data, error } = await supabase
      .from("customer_notes")
      .update(updateData)
      .eq("id", body.noteId)
      .select(NOTE_FIELDS)
      .single();

    if (error) {
      console.error("Update note error:", error.message);
      return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
    }

    return NextResponse.json({ data: convertNote(data as Record<string, unknown>) });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();
    const noteId = request.nextUrl.searchParams.get("noteId");
    if (!noteId) return NextResponse.json({ error: "noteId is required" }, { status: 400 });

    // Ownership check
    const { data: existing } = await supabase
      .from("customer_notes")
      .select("company_id")
      .eq("id", noteId)
      .single();
    if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const { error } = await supabase.from("customer_notes").delete().eq("id", noteId);
    if (error) {
      console.error("Delete note error:", error.message);
      return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
