import { getMaterialsCatalog } from "@/features/materials-catalog/queries/getMaterialsCatalog";
import { MaterialsCatalogManager } from "@/features/materials-catalog";

export default async function MaterialsCatalogPage() {
  const items = await getMaterialsCatalog();

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

  return <MaterialsCatalogManager initialItems={data} />;
}
