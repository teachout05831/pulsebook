import { NextResponse } from "next/server";
import { updateCatalogItem } from "@/features/service-catalog/actions/updateCatalogItem";
import { deleteCatalogItem } from "@/features/service-catalog/actions/deleteCatalogItem";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const input: Record<string, unknown> = {};
    if (body.name !== undefined) input.name = body.name;
    if (body.description !== undefined) input.description = body.description;
    if (body.category !== undefined) input.category = body.category;
    if (body.pricingModel !== undefined) input.pricing_model = body.pricingModel;
    if (body.defaultPrice !== undefined) input.default_price = body.defaultPrice;
    if (body.unitLabel !== undefined) input.unit_label = body.unitLabel;
    if (body.isTaxable !== undefined) input.is_taxable = body.isTaxable;
    if (body.isActive !== undefined) input.is_active = body.isActive;
    if (body.sortOrder !== undefined) input.sort_order = body.sortOrder;

    const result = await updateCatalogItem(id, input);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

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
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await deleteCatalogItem(id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
