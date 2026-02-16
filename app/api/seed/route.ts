import { NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// POST /api/seed - Create test jobs for dispatch testing
// Only works in development
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { supabase, companyId } = await getAuthCompany();

    // Get a customer (or create one if none exist)
    let { data: customers } = await supabase
      .from("customers")
      .select("id, name")
      .eq("company_id", companyId)
      .limit(3);

    if (!customers || customers.length === 0) {
      // Create test customers
      const { data: newCustomers, error: customerError } = await supabase
        .from("customers")
        .insert([
          { company_id: companyId, name: "John Doe", email: "john@example.com", phone: "(555) 123-4567", address: "123 Main St, Austin, TX 78701" },
          { company_id: companyId, name: "Jane Smith", email: "jane@example.com", phone: "(555) 234-5678", address: "456 Oak Ave, Austin, TX 78702" },
          { company_id: companyId, name: "Bob Wilson", email: "bob@example.com", phone: "(555) 345-6789", address: "789 Pine Rd, Austin, TX 78703" },
        ])
        .select("id, name");

      if (customerError) {
        return NextResponse.json({ error: "Failed to create test customers" }, { status: 500 });
      }
      customers = newCustomers;
    }

    // Get team members for assignment
    const { data: teamMembers } = await supabase
      .from("team_members")
      .select("id, name")
      .eq("company_id", companyId)
      .limit(3);

    // Create test jobs for today
    const today = new Date().toISOString().split("T")[0];

    const testJobs = [
      {
        company_id: companyId,
        customer_id: customers[0]?.id || null,
        title: "HVAC Maintenance",
        description: "Annual HVAC system checkup and filter replacement",
        status: "scheduled",
        scheduled_date: today,
        scheduled_time: "09:00",
        estimated_duration: 60,
        address: customers[0] ? "123 Main St, Austin, TX 78701" : "100 Test St",
        assigned_to: teamMembers?.[0]?.id || null,
        notes: "Customer prefers morning appointments",
      },
      {
        company_id: companyId,
        customer_id: customers[1]?.id || null,
        title: "Plumbing Repair",
        description: "Fix leaky faucet in kitchen",
        status: "scheduled",
        scheduled_date: today,
        scheduled_time: "11:00",
        estimated_duration: 45,
        address: customers[1] ? "456 Oak Ave, Austin, TX 78702" : "200 Test Ave",
        assigned_to: teamMembers?.[1]?.id || null,
        notes: null,
      },
      {
        company_id: companyId,
        customer_id: customers[2]?.id || null,
        title: "Electrical Inspection",
        description: "Full home electrical inspection",
        status: "pending", // Unassigned
        scheduled_date: today,
        scheduled_time: "14:00",
        estimated_duration: 90,
        address: customers[2] ? "789 Pine Rd, Austin, TX 78703" : "300 Test Blvd",
        assigned_to: null, // Unassigned
        notes: "New customer - first visit",
      },
      {
        company_id: companyId,
        customer_id: customers[0]?.id || null,
        title: "Emergency AC Repair",
        description: "AC unit not cooling - urgent",
        status: "pending", // Unassigned
        scheduled_date: today,
        scheduled_time: "16:00",
        estimated_duration: 120,
        address: customers[0] ? "123 Main St, Austin, TX 78701" : "100 Test St",
        assigned_to: null, // Unassigned
        notes: "Customer reports AC stopped working yesterday",
      },
    ];

    const { data: jobs, error: jobError } = await supabase
      .from("jobs")
      .insert(testJobs)
      .select("id, title, status, scheduled_date, scheduled_time");

    if (jobError) {
      return NextResponse.json({ error: "Failed to create test jobs" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Test data created successfully",
      data: {
        customers: customers?.length || 0,
        teamMembers: teamMembers?.length || 0,
        jobs: jobs?.length || 0,
        jobDetails: jobs,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
