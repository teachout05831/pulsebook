import { getBillingSettings } from '@/features/billing-settings/queries/getBillingSettings';
import { BillingSettingsForm } from '@/features/billing-settings';

export const metadata = {
  title: 'Billing & Invoicing - Settings',
  description: 'Configure billing and invoicing settings',
};

export default async function BillingSettingsPage() {
  const settings = await getBillingSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Billing & Invoicing</h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure payment terms, tax rates, and invoice settings
        </p>
      </div>
      <BillingSettingsForm initialSettings={settings} />
    </div>
  );
}
