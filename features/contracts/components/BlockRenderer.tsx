'use client'

import { HeadingBlock } from './blocks/HeadingBlock'
import { TextBlock } from './blocks/TextBlock'
import { ColumnLayoutBlock } from './blocks/ColumnLayoutBlock'
import { PricingTableBlock } from './blocks/PricingTableBlock'
import { SignatureBlock } from './blocks/SignatureBlock'
import { TimestampHourlyBlock } from './blocks/TimestampHourlyBlock'
import { CalloutBlock } from './blocks/CalloutBlock'
import { PaymentBlock } from './blocks/PaymentBlock'
import { DetailGridBlock } from './blocks/DetailGridBlock'
import { CheckboxListBlock } from './blocks/CheckboxListBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { StatusTrackerBlock } from './blocks/StatusTrackerBlock'
import { TableBlock } from './blocks/TableBlock'
import { CompanyHeaderBlock } from './blocks/CompanyHeaderBlock'
import { CustomHtmlBlock } from './blocks/CustomHtmlBlock'
import type { ContractBlock, BlockMode } from '../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

const BLOCK_COMPONENTS: Record<
  ContractBlock['type'],
  React.ComponentType<Props>
> = {
  heading: HeadingBlock,
  text: TextBlock,
  column_layout: ColumnLayoutBlock,
  pricing_table: PricingTableBlock,
  signature: SignatureBlock,
  timestamp_hourly: TimestampHourlyBlock,
  callout: CalloutBlock,
  payment: PaymentBlock,
  detail_grid: DetailGridBlock,
  checkbox_list: CheckboxListBlock,
  divider: DividerBlock,
  status_tracker: StatusTrackerBlock,
  table: TableBlock,
  company_header: CompanyHeaderBlock,
  custom_html: CustomHtmlBlock,
}

export function BlockRenderer({ block, mode, onUpdate }: Props) {
  const Component = BLOCK_COMPONENTS[block.type]

  if (!Component) {
    return (
      <div className="rounded border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-600">
        Unknown block type: {block.type}
      </div>
    )
  }

  return <Component block={block} mode={mode} onUpdate={onUpdate} />
}
