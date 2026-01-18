import { NextRequest, NextResponse } from "next/server";
import { mockCustomers } from "./data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse pagination params
  const page = parseInt(searchParams.get("_page") || "1", 10);
  const limit = parseInt(searchParams.get("_limit") || "10", 10);

  // Parse sorting params
  const sortField = searchParams.get("_sort");
  const sortOrder = searchParams.get("_order") || "asc";

  // Parse search/filter params
  const searchQuery = searchParams.get("q"); // General search across name, email, phone
  const nameFilter = searchParams.get("name_like");
  const emailFilter = searchParams.get("email_like");
  const phoneFilter = searchParams.get("phone_like");

  // Filter customers
  let filteredCustomers = [...mockCustomers];

  // General search (searches across name, email, phone)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredCustomers = filteredCustomers.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.includes(searchQuery)
    );
  }

  if (nameFilter) {
    filteredCustomers = filteredCustomers.filter(c =>
      c.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }
  if (emailFilter) {
    filteredCustomers = filteredCustomers.filter(c =>
      c.email?.toLowerCase().includes(emailFilter.toLowerCase())
    );
  }
  if (phoneFilter) {
    filteredCustomers = filteredCustomers.filter(c =>
      c.phone?.includes(phoneFilter)
    );
  }

  // Sort customers
  if (sortField) {
    filteredCustomers.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortField];
      const bVal = (b as unknown as Record<string, unknown>)[sortField];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Paginate
  const total = filteredCustomers.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Return in the format expected by the data provider
  return NextResponse.json({
    data: paginatedCustomers,
    total,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate a new ID
  const maxId = Math.max(...mockCustomers.map(c => parseInt(c.id, 10)), 0);
  const newId = (maxId + 1).toString();

  const newCustomer = {
    id: newId,
    companyId: "demo-tenant",
    name: body.name || "",
    email: body.email || "",
    phone: body.phone || "",
    address: body.address || "",
    notes: body.notes || null,
    customFields: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to mock data (won't persist across requests)
  mockCustomers.push(newCustomer);

  return NextResponse.json({
    data: newCustomer,
  }, { status: 201 });
}
