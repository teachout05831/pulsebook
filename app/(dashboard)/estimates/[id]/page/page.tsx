import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props { params: Promise<{ id: string }> }

export default async function EstimatePageBuilderPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: estimate } = await supabase
    .from("estimates")
    .select("id, estimate_pages(id)")
    .eq("id", id)
    .single();

  if (!estimate?.estimate_pages?.[0]?.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Page Found</h1>
          <p className="text-muted-foreground mb-4">This estimate doesn&apos;t have a customer page yet.</p>
          <a href={`/estimates/${id}`} className="text-blue-600 hover:underline">Back to Estimate</a>
        </div>
      </div>
    );
  }

  redirect(`/estimate-pages/${estimate.estimate_pages[0].id}`);
}
