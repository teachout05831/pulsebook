import { ContractTemplateList } from '@/features/contracts';
import { TimeTrackingSettings } from '@/features/contracts/components/TimeTrackingSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Contracts - Settings',
  description: 'Manage contract templates and time tracking',
};

export default function ContractsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Contracts</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage contract templates and time tracking settings
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="timetracking">Time Tracking</TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="mt-6">
          <ContractTemplateList />
        </TabsContent>
        <TabsContent value="timetracking" className="mt-6">
          <TimeTrackingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
