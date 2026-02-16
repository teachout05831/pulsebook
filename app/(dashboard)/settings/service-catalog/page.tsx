import { getServiceCatalog } from "@/features/service-catalog/queries/getServiceCatalog";
import { ServiceCatalogManager } from "@/features/service-catalog";

export default async function ServiceCatalogPage() {
  const items = await getServiceCatalog();

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

  return <ServiceCatalogManager initialItems={data} />;
}
