import { CustomerPortalSettingsPanel } from "@/features/customer-portal/components/CustomerPortalSettingsPanel";

export const metadata = {
  title: "Customer Portal - Settings",
  description: "Configure customer portal settings",
};

export default function CustomerPortalPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Customer Portal</h1>
        <p className="text-sm text-slate-600 mt-1">
          Configure visibility settings and access for the customer portal
        </p>
      </div>
      <CustomerPortalSettingsPanel />
    </div>
  );
}
