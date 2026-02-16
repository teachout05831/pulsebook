import { CustomFieldsManager } from '@/features/custom-fields';
import { PrebuiltFieldsSection } from '@/features/prebuilt-fields';

export const metadata = {
  title: 'Custom Fields - Settings',
  description: 'Manage custom fields for customers and jobs',
};

export default function CustomFieldsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Custom Fields</h1>
        <p className="text-sm text-slate-600 mt-1">
          Define custom fields for customers and jobs. Fields are grouped into sections and appear on create/edit forms.
        </p>
      </div>
      <div className="space-y-6">
        <PrebuiltFieldsSection />
        <CustomFieldsManager />
      </div>
    </div>
  );
}
