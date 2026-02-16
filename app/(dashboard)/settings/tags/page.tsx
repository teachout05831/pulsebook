import { TagsManager } from '@/features/tags';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Tags - Settings',
  description: 'Manage customer and job tags',
};

export default function TagsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Tags</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage tags to categorize and filter customers and jobs
        </p>
      </div>

      <Tabs defaultValue="customer" className="w-full">
        <TabsList>
          <TabsTrigger value="customer">Customer Tags</TabsTrigger>
          <TabsTrigger value="job">Job Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="customer" className="mt-6">
          <TagsManager />
        </TabsContent>
        <TabsContent value="job" className="mt-6">
          <TagsManager entityType="job" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
