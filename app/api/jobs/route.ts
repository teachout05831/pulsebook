import { NextRequest, NextResponse } from "next/server";
import { mockJobs } from "./data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse pagination params
  const page = parseInt(searchParams.get("_page") || "1", 10);
  const limit = parseInt(searchParams.get("_limit") || "10", 10);

  // Parse sorting params
  const sortField = searchParams.get("_sort");
  const sortOrder = searchParams.get("_order") || "asc";

  // Parse filter params
  const searchQuery = searchParams.get("q");
  const statusFilter = searchParams.get("status");
  const customerIdFilter = searchParams.get("customerId");

  // Filter jobs
  let filteredJobs = [...mockJobs];

  // General search (searches across title, customerName, address)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredJobs = filteredJobs.filter(j =>
      j.title.toLowerCase().includes(query) ||
      j.customerName.toLowerCase().includes(query) ||
      j.address?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (statusFilter) {
    filteredJobs = filteredJobs.filter(j => j.status === statusFilter);
  }

  // Customer filter
  if (customerIdFilter) {
    filteredJobs = filteredJobs.filter(j => j.customerId === customerIdFilter);
  }

  // Sort jobs
  if (sortField) {
    filteredJobs.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField];
      const bVal = (b as unknown as Record<string, unknown>)[sortField];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  } else {
    // Default sort by scheduledDate descending
    filteredJobs.sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
  }

  // Paginate
  const total = filteredJobs.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedJobs,
    total,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate a new ID
  const maxId = Math.max(...mockJobs.map(j => parseInt(j.id, 10)), 0);
  const newId = (maxId + 1).toString();

  const newJob = {
    id: newId,
    companyId: "demo-tenant",
    customerId: body.customerId || "",
    customerName: body.customerName || "",
    title: body.title || "",
    description: body.description || null,
    status: body.status || "scheduled",
    scheduledDate: body.scheduledDate || new Date().toISOString().split("T")[0],
    scheduledTime: body.scheduledTime || null,
    estimatedDuration: body.estimatedDuration || null,
    address: body.address || null,
    assignedTo: body.assignedTo || null,
    notes: body.notes || null,
    customFields: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockJobs.push(newJob);

  return NextResponse.json({
    data: newJob,
  }, { status: 201 });
}
