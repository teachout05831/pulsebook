import { NextRequest, NextResponse } from "next/server";
import { getServiceCatalog } from "@/features/service-catalog/queries/getServiceCatalog";
import { createCatalogItem } from "@/features/service-catalog/actions/createCatalogItem";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const items = await getServiceCatalog(from, to);

    const data = items.map((s) => ({
      id: s.id,
      companyId: s.company_id,
      name: s.name,
      description: s.description,
      category: s.category,
      pricingModel: s.pricing_model,
      defaultPrice: s.default_price,
      unitLabel: s.unit_label,
      isTaxable: s.is_taxable,
      isActive: s.is_active,
      sortOrder: s.sort_order,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));

    return NextResponse.json({ data, page, limit }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createCatalogItem({
      name: body.name,
      description: body.description || null,
      category: body.category || "primary",
      pricing_model: body.pricingModel || "flat",
      default_price: body.defaultPrice || 0,
      unit_label: body.unitLabel || null,
      is_taxable: body.isTaxable ?? true,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const s = result.data!;
    return NextResponse.json({
      data: {
        id: s.id,
        companyId: s.company_id,
        name: s.name,
        description: s.description,
        category: s.category,
        pricingModel: s.pricing_model,
        defaultPrice: s.default_price,
        unitLabel: s.unit_label,
        isTaxable: s.is_taxable,
        isActive: s.is_active,
        sortOrder: s.sort_order,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
