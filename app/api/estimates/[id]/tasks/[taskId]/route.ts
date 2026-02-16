import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string; taskId: string }>;
}

const TASK_FIELDS =
  "id, estimate_id, title, completed, due_date, assigned_to, sort_order";

// PATCH /api/estimates/[id]/tasks/[taskId] - Update a task
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, taskId } = await params;
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

    // Verify task belongs to this estimate
    const { data: existing } = await supabase
      .from("estimate_tasks")
      .select("id, estimate_id")
      .eq("id", taskId)
      .eq("estimate_id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.completed !== undefined) updateData.completed = body.completed;
    if (body.dueDate !== undefined) updateData.due_date = body.dueDate;
    if (body.assignedTo !== undefined) updateData.assigned_to = body.assignedTo;
    if (body.sortOrder !== undefined) updateData.sort_order = body.sortOrder;

    const { data, error } = await supabase
      .from("estimate_tasks")
      .update(updateData)
      .eq("id", taskId)
      .select(TASK_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
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

    return NextResponse.json({ data: task });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/estimates/[id]/tasks/[taskId] - Delete a task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, taskId } = await params;
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

    // Verify task belongs to this estimate
    const { data: existing } = await supabase
      .from("estimate_tasks")
      .select("id, estimate_id")
      .eq("id", taskId)
      .eq("estimate_id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("estimate_tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
