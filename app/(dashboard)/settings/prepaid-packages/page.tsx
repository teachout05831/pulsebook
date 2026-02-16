import { getServicePackages } from "@/features/prepaid-packages/queries/getServicePackages";
import { PackageManager } from "@/features/prepaid-packages";
import type { ServicePackage } from "@/features/prepaid-packages/types";

export default async function PrepaidPackagesPage() {
  let data: ServicePackage[] = [];

  try {
    const items = await getServicePackages();
    data = items.map((s) => ({
      id: s.id,
      companyId: s.company_id,
      name: s.name,
      visitCount: s.visit_count,
      totalPrice: s.total_price,
      perVisitPrice: s.per_visit_price,
      discountPercent: s.discount_percent || 0,
      isActive: s.is_active,
      createdAt: s.created_at,
    }));
  } catch {
    // Table may not exist yet — render empty state
  }

  return <PackageManager initialItems={data} />;
}
