import { getServiceTypes } from '@/features/service-types/queries/getServiceTypes';
import { ServiceTypesManager } from '@/features/service-types';

export const metadata = {
  title: 'Service Types - Settings',
  description: 'Manage service types and default pricing',
};

export default async function ServiceTypesPage() {
  const serviceTypes = await getServiceTypes();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Service Types</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage the types of services you offer and their default pricing
        </p>
      </div>
      <ServiceTypesManager initialServiceTypes={serviceTypes} />
    </div>
  );
}
