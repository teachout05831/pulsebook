import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import type { DocumentItem, DocumentStatus } from "@/features/documents/types";

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const url = new URL(request.url);
    const estimateId = url.searchParams.get("estimateId");
    const jobId = url.searchParams.get("jobId");
    if (!estimateId && !jobId) return NextResponse.json({ error: "estimateId or jobId required" }, { status: 400 });

    const results: DocumentItem[] = [];

    // 1. Estimate pages (if estimateId provided)
    if (estimateId) {
      const { data: pages } = await supabase.from("estimate_pages")
        .select("id, status, public_token, published_at, created_at")
        .eq("company_id", companyId).eq("estimate_id", estimateId)
        .order("created_at", { ascending: false }).limit(50);

      for (const p of pages || []) {
        results.push({
          id: p.id, type: "estimate_page", name: "Estimate Page",
          status: (p.published_at ? "published" : "draft") as DocumentStatus,
          entityType: "estimate", entityId: estimateId,
          publicToken: p.public_token, createdAt: p.created_at,
        });
      }
    }

    // 2. Contract instances (if jobId provided)
    if (jobId) {
      const { data: contracts } = await supabase.from("contract_instances")
        .select("id, status, signing_token, created_at")
        .eq("company_id", companyId).eq("job_id", jobId)
        .order("created_at", { ascending: false }).limit(50);

      for (const c of contracts || []) {
        results.push({
          id: c.id, type: "contract", name: "Contract",
          status: c.status as DocumentStatus,
          entityType: "job", entityId: jobId,
          publicToken: c.signing_token, createdAt: c.created_at,
        });
      }
    }

    // 3. Documents table (invoices, work orders)
    let docsQuery = supabase.from("documents")
      .select("id, type, name, status, estimate_id, job_id, public_token, created_at")
      .eq("company_id", companyId);

    if (estimateId && jobId) {
      docsQuery = docsQuery.or(`estimate_id.eq.${estimateId},job_id.eq.${jobId}`);
    } else if (estimateId) {
      docsQuery = docsQuery.eq("estimate_id", estimateId);
    } else if (jobId) {
      docsQuery = docsQuery.eq("job_id", jobId);
    }

    const { data: docs } = await docsQuery.order("created_at", { ascending: false }).limit(50);
    for (const d of docs || []) {
      results.push({
        id: d.id, type: d.type as DocumentItem["type"], name: d.name,
        status: d.status as DocumentStatus,
        entityType: d.job_id ? "job" : "estimate",
        entityId: (d.job_id || d.estimate_id) as string,
        publicToken: d.public_token, createdAt: d.created_at,
      });
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ data: results }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
