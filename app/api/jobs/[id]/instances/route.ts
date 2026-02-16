import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getJobInstances } from "@/features/recurring-jobs/queries";
import { generateInstances } from "@/features/recurring-jobs/actions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const data = await getJobInstances(supabase, companyId, id);
    const instances = (data || []).map((i) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      scheduledDate: i.scheduled_date,
      scheduledTime: i.scheduled_time,
      instanceDate: i.instance_date,
      parentJobId: i.parent_job_id,
      assignedTo: i.assigned_to,
      address: i.address,
    }));
    return NextResponse.json({ data: instances }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch instances" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Fetch the template job
    const { data: template } = await supabase
      .from("jobs")
      .select("id, company_id, customer_id, title, description, scheduled_time, estimated_duration, address, assigned_to, notes, custom_fields, tags, recurrence_config")
      .eq("id", id)
      .eq("company_id", companyId)
      .eq("is_recurring_template", true)
      .single();

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const daysAhead = body.daysAhead || 30;

    const result = await generateInstances(supabase, companyId, template, daysAhead);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: { count: result.count } }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
