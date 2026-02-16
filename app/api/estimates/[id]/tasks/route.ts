import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const TASK_FIELDS =
  "id, estimate_id, title, completed, due_date, assigned_to, sort_order";

// GET /api/estimates/[id]/tasks - List tasks for an estimate
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify estimate ownership
    const { data: est } = await supabase
      .from("estimates")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!est || est.company_id !== companyId) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("estimate_tasks")
      .select(TASK_FIELDS)
      .eq("estimate_id", id)
      .order("sort_order", { ascending: true })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }

    const tasks = (data || []).map((t) => ({
      id: t.id,
      estimateId: t.estimate_id,
      title: t.title,
      completed: t.completed,
      dueDate: t.due_date,
      assignedTo: t.assigned_to,
      assignedName: null,
      sortOrder: t.sort_order,
    }));

    return NextResponse.json({ data: tasks }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/estimates/[id]/tasks - Create a task
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify estimate ownership
    const { data: est } = await supabase
      .from("estimates")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!est || est.company_id !== companyId) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 403 });
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.length < 1) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("estimate_tasks")
      .insert({
        estimate_id: id,
        company_id: companyId,
        title: body.title,
        completed: false,
        due_date: body.dueDate || null,
        assigned_to: body.assignedTo || null,
        sort_order: body.sortOrder ?? 0,
      })
      .select(TASK_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }

    const task = {
      id: data.id,
      estimateId: data.estimate_id,
      title: data.title,
      completed: data.completed,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      assignedName: null,
      sortOrder: data.sort_order,
    };

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
