import type { ContractBlock, BlockType } from '../types'

export function migrateBlocks(blocks: ContractBlock[]): ContractBlock[] {
  return blocks.map((block) => {
    if ((block.type as string) === 'two_column') {
      return {
        ...block,
        type: 'column_layout' as BlockType,
        content: {
          columnCount: 2,
          columns: [
            { id: crypto.randomUUID(), cellType: 'text', content: { text: block.content.left || '' } },
            { id: crypto.randomUUID(), cellType: 'text', content: { text: block.content.right || '' } },
          ],
        },
      }
    }
    return block
  })
}
