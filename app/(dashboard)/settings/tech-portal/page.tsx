import { TechPortalSettings } from '@/features/tech-portal';

export const metadata = {
  title: 'Tech Portal - Settings',
  description: 'Configure technician portal settings',
};

export default function TechPortalPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Tech Portal</h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure privacy settings and access for the technician portal
        </p>
      </div>
      <TechPortalSettings />
    </div>
  );
}
