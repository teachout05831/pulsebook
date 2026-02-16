import { NextResponse } from "next/server";
import { updateMaterial } from "@/features/materials-catalog/actions/updateMaterial";
import { deleteMaterial } from "@/features/materials-catalog/actions/deleteMaterial";

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
    if (body.unitPrice !== undefined) input.unit_price = body.unitPrice;
    if (body.unitLabel !== undefined) input.unit_label = body.unitLabel;
    if (body.sku !== undefined) input.sku = body.sku;
    if (body.isTaxable !== undefined) input.is_taxable = body.isTaxable;
    if (body.isActive !== undefined) input.is_active = body.isActive;
    if (body.sortOrder !== undefined) input.sort_order = body.sortOrder;

    const result = await updateMaterial(id, input);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

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
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await deleteMaterial(id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
