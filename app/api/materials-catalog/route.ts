import { NextRequest, NextResponse } from "next/server";
import { getMaterialsCatalog } from "@/features/materials-catalog/queries/getMaterialsCatalog";
import { createMaterial } from "@/features/materials-catalog/actions/createMaterial";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const items = await getMaterialsCatalog(from, to);

    const data = items.map((m) => ({
      id: m.id,
      companyId: m.company_id,
      name: m.name,
      description: m.description,
      unitPrice: m.unit_price,
      unitLabel: m.unit_label,
      sku: m.sku,
      isTaxable: m.is_taxable,
      isActive: m.is_active,
      sortOrder: m.sort_order,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }));

    return NextResponse.json({ data, page, limit }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createMaterial({
      name: body.name,
      description: body.description || null,
      unit_price: body.unitPrice || 0,
      unit_label: body.unitLabel || "each",
      sku: body.sku || null,
      is_taxable: body.isTaxable ?? true,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const m = result.data!;
    return NextResponse.json({
      data: {
        id: m.id,
        companyId: m.company_id,
        name: m.name,
        description: m.description,
        unitPrice: m.unit_price,
        unitLabel: m.unit_label,
        sku: m.sku,
        isTaxable: m.is_taxable,
        isActive: m.is_active,
        sortOrder: m.sort_order,
        createdAt: m.created_at,
        updatedAt: m.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
