import { createClient } from "@/lib/supabase/server";

const BLOCK_FIELDS = "id, settings, content" as const;

export async function syncUniversalBlocks<T extends Record<string, any>>(
  sections: T[],
  companyId: string
): Promise<T[]> {
  const connectedIds = sections
    .filter((s) => s.universalBlockId && s.isConnected)
    .map((s) => s.universalBlockId as string);

  if (connectedIds.length === 0) return sections;

  const supabase = await createClient();
  const { data: blocks } = await supabase
    .from("universal_blocks")
    .select(BLOCK_FIELDS)
    .in("id", connectedIds)
    .eq("company_id", companyId)
    .limit(connectedIds.length);

  if (!blocks || blocks.length === 0) return sections;

  const blockMap = new Map(blocks.map((b) => [b.id, b]));

  return sections.map((s) => {
    if (!s.universalBlockId || !s.isConnected) return s;
    const block = blockMap.get(s.universalBlockId);
    if (!block) {
      return { ...s, isConnected: false, universalBlockId: undefined, universalBlockName: undefined };
    }
    return { ...s, settings: block.settings || {}, content: block.content || {} };
  });
}
