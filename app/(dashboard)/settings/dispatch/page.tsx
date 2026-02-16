import { DispatchSettingsManager } from '@/features/dispatch-settings';
import { getDispatchSettings } from '@/features/dispatch-settings/queries/getDispatchSettings';

export const metadata = {
  title: 'Dispatch Center - Settings',
  description: 'Configure dispatch and scheduling settings',
};

export default async function DispatchSettingsPage() {
  const settings = await getDispatchSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dispatch Center Settings</h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure which dispatch views are available and set the default view for your team
        </p>
      </div>
      <DispatchSettingsManager initialSettings={settings} />
    </div>
  );
}
