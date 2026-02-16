import { NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { SAMPLE_TEMPLATES } from "@/features/contracts/data/sampleTemplates";

export async function POST() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const created: string[] = [];

    for (const tpl of SAMPLE_TEMPLATES) {
      const blocks = tpl.getBlocks();
      const { data, error } = await supabase
        .from("contract_templates")
        .insert({
          company_id: companyId,
          name: tpl.name,
          description: tpl.description,
          category: tpl.category,
          design_theme: tpl.designTheme,
          blocks,
          is_active: false,
        })
        .select("id, name")
        .single();

      if (error) {
        if (error.code === "23505") continue;
        return NextResponse.json({ error: `Failed to create: ${tpl.name}` }, { status: 500 });
      }
      if (data) created.push(data.name);
    }

    return NextResponse.json({
      data: { created, count: created.length },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
