import type { ContractBlock, ColumnCell } from '../types'

const SAMPLE_VARS: Record<string, string> = {
  '@CustomerName': 'Jane Smith',
  '@Phone': '(555) 867-5309',
  '@Email': 'jane.smith@email.com',
  '@Address': '1234 Oak Street, Phoenix, AZ 85001',
  '@DestAddress': '5678 Maple Avenue, Scottsdale, AZ 85251',
  '@Date': new Date().toLocaleDateString(),
  '@CrewCount': '3',
  '@HourlyRate': '185.00',
  '@TotalHours': '4.5',
  '@LaborCost': '832.50',
  '@AdditionalCosts': '75.00',
  '@Subtotal': '982.50',
  '@Tip': '150.00',
  '@TotalDue': '1,132.50',
  '@DepositPaid': '200.00',
  '@BalanceDue': '932.50',
  '@JobTitle': 'Local Move — Phoenix to Scottsdale',
}

function replaceVars(val: string, vars: Record<string, string>): string {
  for (const [k, v] of Object.entries(vars)) {
    val = val.replaceAll(k, v)
  }
  return val
}

export function fillVariables(
  blocks: ContractBlock[],
  vars: Record<string, string> = SAMPLE_VARS
): ContractBlock[] {
  return blocks.map((block) => {
    const content = { ...block.content }
    for (const key of Object.keys(content)) {
      if (typeof content[key] === 'string') {
        content[key] = replaceVars(content[key] as string, vars)
      }
      if (key === 'rows' && Array.isArray(content[key])) {
        content[key] = (content[key] as { label: string; value: string }[]).map((row) => ({
          ...row,
          value: replaceVars(row.value, vars),
        }))
      }
      if (key === 'columns' && Array.isArray(content[key])) {
        content[key] = (content[key] as ColumnCell[]).map((col) => {
          const cc = { ...col.content }
          for (const ck of Object.keys(cc)) {
            if (typeof cc[ck] === 'string') {
              cc[ck] = replaceVars(cc[ck] as string, vars)
            }
          }
          return { ...col, content: cc }
        })
      }
    }
    return { ...block, content }
  })
}
