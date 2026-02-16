import type { ContractBlock, BlockStage } from '../types'

function block(
  type: ContractBlock['type'],
  stage: BlockStage,
  content: Record<string, unknown>,
  order: number,
  settings?: Partial<ContractBlock['settings']>
): ContractBlock {
  return {
    id: crypto.randomUUID(),
    type,
    stage,
    content,
    settings: {
      border: 'none',
      background: '#FFFFFF',
      padding: 'md',
      width: 'full',
      ...settings,
    },
    order,
  }
}

export function getMovingContractBlocks(): ContractBlock[] {
  let i = 0
  return [
    // ── COMPANY BRANDING ──────────────────────────────────
    block('company_header', 'before_job', {
      layout: 'left',
      showLogo: true, showName: true, showTagline: true,
      showPhone: true, showEmail: true, showAddress: true,
    }, i++),

    block('heading', 'before_job', { text: 'MOVING SERVICE AGREEMENT', level: 'h1' }, i++),

    block('detail_grid', 'before_job', {
      columns: 2,
      rows: [
        { label: 'Contract Date', value: '@Date' },
        { label: 'Scheduled Move Date', value: '@Date' },
        { label: 'Job Reference', value: '@JobTitle' },
      ],
    }, i++),

    block('divider', 'before_job', { style: 'solid' }, i++),

    // ── CUSTOMER INFORMATION ──────────────────────────────
    block('heading', 'before_job', { text: 'Customer Information', level: 'h2' }, i++),

    block('column_layout', 'before_job', {
      columnCount: 2,
      columns: [
        {
          id: crypto.randomUUID(), cellType: 'detail_grid',
          content: {
            columns: 1,
            rows: [
              { label: 'Name', value: '@CustomerName' },
              { label: 'Phone', value: '@Phone' },
              { label: 'Email', value: '@Email' },
            ],
          },
        },
        {
          id: crypto.randomUUID(), cellType: 'detail_grid',
          content: {
            columns: 1,
            rows: [
              { label: 'Origin Address', value: '@Address' },
              { label: 'Destination Address', value: '@DestAddress' },
            ],
          },
        },
      ],
    }, i++),

    block('divider', 'before_job', { style: 'solid' }, i++),

    // ── DESCRIPTION OF SERVICES ───────────────────────────
    block('heading', 'before_job', { text: 'Description of Services', level: 'h2' }, i++),

    block('checkbox_list', 'before_job', {
      title: 'Services Included',
      items: [
        { label: 'Loading and unloading of household goods', checked: true },
        { label: 'Transportation from origin to destination', checked: true },
        { label: 'Basic furniture disassembly and reassembly', checked: false },
        { label: 'Packing and wrapping services', checked: false },
        { label: 'Specialty item handling (piano, safe, antiques)', checked: false },
        { label: 'Temporary storage', checked: false },
      ],
    }, i++),

    block('detail_grid', 'before_job', {
      columns: 2,
      rows: [
        { label: 'Crew Size', value: '@CrewCount movers' },
        { label: 'Truck(s)', value: '1 — 26ft box truck' },
        { label: 'Hourly Rate', value: '$@HourlyRate/hr' },
        { label: 'Minimum Hours', value: '2 hours' },
        { label: 'Travel/Trip Fee', value: '$75.00' },
        { label: 'Payment Methods', value: 'Cash, Card, Venmo, Zelle' },
      ],
    }, i++),

    block('divider', 'before_job', { style: 'solid' }, i++),

    // ── PRICING ESTIMATE ──────────────────────────────────
    block('heading', 'before_job', { text: 'Pricing Estimate', level: 'h2' }, i++),

    block('pricing_table', 'before_job', {
      showTotal: true,
      items: [
        { description: 'Moving labor (estimated 4 hours)', qty: 4, rate: 185 },
        { description: 'Travel/trip fee', qty: 1, rate: 75 },
        { description: 'Packing materials', qty: 1, rate: 0 },
        { description: 'Fuel surcharge', qty: 1, rate: 0 },
      ],
    }, i++),

    block('callout', 'before_job', {
      variant: 'info',
      text: 'This is a NON-BINDING estimate. The final charge will be based on actual time worked at the hourly rate listed above. The final invoice will be presented upon completion of all services.',
    }, i++),

    block('divider', 'before_job', { style: 'solid' }, i++),

    // ── VALUATION & LIABILITY ─────────────────────────────
    block('heading', 'before_job', { text: 'Valuation & Liability Protection', level: 'h2' }, i++),

    block('callout', 'before_job', {
      variant: 'warning',
      text: 'IMPORTANT: Federal law requires carriers to offer two levels of liability coverage. Please review the options below and select your preferred coverage before the move begins.',
    }, i++, { background: '#FEF3C7' }),

    block('table', 'before_job', {
      headers: ['Protection Level', 'Coverage', 'Cost', 'Example'],
      rows: [
        [
          'Released Value',
          '$0.60 per pound per article',
          'Included — no charge',
          '50 lb television = $30 maximum payout',
        ],
        [
          'Full Value Protection',
          'Repair, replace, or cash settlement at current market value',
          'Approx. 1% of total declared value',
          '$10,000 declared = ~$100 premium',
        ],
      ],
    }, i++),

    block('checkbox_list', 'before_job', {
      title: 'Select Your Coverage',
      items: [
        { label: 'Released Value Protection — $0.60/lb per article (included at no charge)', checked: false },
        { label: 'Full Value Protection — Carrier will repair, replace, or settle at current market value', checked: false },
      ],
    }, i++),

    block('text', 'before_job', {
      text: 'Declared Value of Shipment: $____________\n\nItems valued over $100 per pound (electronics, jewelry, art, collectibles) must be listed on a separate high-value inventory form. The carrier is not liable for undeclared high-value items.',
    }, i++),

    block('divider', 'before_job', { style: 'solid' }, i++),

    // ── PAYMENT TERMS ─────────────────────────────────────
    block('heading', 'before_job', { text: 'Payment Terms', level: 'h2' }, i++),

    block('detail_grid', 'before_job', {
      columns: 2,
      rows: [
        { label: 'Deposit Required', value: '$@DepositPaid' },
        { label: 'Deposit Due', value: 'At booking confirmation' },
        { label: 'Balance Due', value: 'Upon completion of move' },
        { label: 'Accepted Methods', value: 'Cash, Credit/Debit, Venmo, Zelle' },
      ],
    }, i++),

    block('text', 'before_job', {
      text: 'A deposit is required to secure your move date and will be applied to the final balance. The remaining balance is due in full upon completion of all services. The carrier reserves the right to hold goods until payment is received in full.',
    }, i++),

    block('divider', 'before_job', { style: 'solid' }, i++),

    // ── PRE-MOVE AUTHORIZATION ────────────────────────────
    block('heading', 'before_job', { text: 'Pre-Move Authorization', level: 'h2' }, i++),

    block('text', 'before_job', {
      text: 'By signing below, I authorize the carrier to transport the household goods described herein from the origin to the destination listed above. I understand the hourly rate begins when the crew arrives at the origin and ends when the last item is placed at the destination. I acknowledge the minimum hour requirement and agree to the terms of this agreement.',
    }, i++),

    block('checkbox_list', 'before_job', {
      title: '',
      items: [
        { label: 'I have reviewed and selected my valuation coverage option', checked: false },
        { label: 'I understand the hourly billing structure and minimum charge', checked: false },
        { label: 'I have disclosed all items requiring special handling', checked: false },
        { label: 'I have secured or removed items not being moved', checked: false },
      ],
    }, i++),

    block('column_layout', 'before_job', {
      columnCount: 2,
      columns: [
        {
          id: crypto.randomUUID(), cellType: 'signature',
          content: { role: 'Customer', label: 'Customer Authorization', description: 'I authorize this move and agree to all terms above.' },
        },
        {
          id: crypto.randomUUID(), cellType: 'signature',
          content: { role: 'Technician', label: 'Company Representative', description: 'Confirmed on behalf of the carrier.' },
        },
      ],
    }, i++),

    // ── CREW: JOB PROGRESS ────────────────────────────────
    block('heading', 'crew', { text: 'Job Progress', level: 'h2' }, i++),

    block('status_tracker', 'crew', {
      steps: ['Pre-Walk', 'Loading', 'In Transit', 'Unloading', 'Final Walk', 'Complete'],
      currentStep: 0,
      events: [],
    }, i++),

    block('heading', 'crew', { text: 'Time Tracking', level: 'h2' }, i++),

    block('timestamp_hourly', 'crew', {
      hourlyRate: 185,
      breakMinutes: 0,
    }, i++),

    // ── AFTER JOB: BILLING ────────────────────────────────
    block('heading', 'after_job', { text: 'Additional Charges', level: 'h2' }, i++),

    block('pricing_table', 'after_job', {
      showTotal: true,
      items: [
        { description: 'Stairs/elevator carry (per flight)', qty: 0, rate: 75 },
        { description: 'Long carry fee (75ft+)', qty: 0, rate: 50 },
        { description: 'Furniture disassembly/reassembly', qty: 0, rate: 25 },
        { description: 'Packing materials used', qty: 0, rate: 0 },
        { description: 'Bulky/specialty item surcharge', qty: 0, rate: 0 },
      ],
    }, i++),

    block('heading', 'after_job', { text: 'Final Invoice', level: 'h2' }, i++),

    block('detail_grid', 'after_job', {
      columns: 1,
      rows: [
        { label: 'Total Hours Worked', value: '@TotalHours hours' },
        { label: 'Labor Cost', value: '$@LaborCost' },
        { label: 'Trip Fee', value: '$75.00' },
        { label: 'Additional Charges', value: '$@AdditionalCosts' },
        { label: 'Subtotal', value: '$@Subtotal' },
        { label: 'Deposit Applied', value: '-$@DepositPaid' },
        { label: 'Tip', value: '$@Tip' },
        { label: 'Balance Due', value: '$@BalanceDue' },
      ],
    }, i++, { background: '#F9FAFB' }),

    block('callout', 'after_job', {
      variant: 'info',
      text: 'Tips are not required but greatly appreciated. Tips can be given directly to the crew as cash or added to your card payment. Typical tip range is 15–20% of the total labor cost.',
    }, i++),

    block('payment', 'after_job', { amount: 0, paymentType: 'full' }, i++),

    block('divider', 'after_job', { style: 'solid' }, i++),

    // ── COMPLETION & INSPECTION ───────────────────────────
    block('heading', 'after_job', { text: 'Completion & Inspection', level: 'h2' }, i++),

    block('text', 'after_job', {
      text: 'The customer has inspected all delivered items and the condition of both origin and destination properties. Any visible damage to items or property must be noted below. Claims for concealed damage must be submitted in writing within 9 months of delivery.',
    }, i++),

    block('checkbox_list', 'after_job', {
      title: 'Post-Move Inspection',
      items: [
        { label: 'All items have been delivered and placed as directed', checked: false },
        { label: 'No visible damage to items during transit', checked: false },
        { label: 'No damage to origin or destination property', checked: false },
        { label: 'All equipment and materials have been removed by crew', checked: false },
      ],
    }, i++),

    block('column_layout', 'after_job', {
      columnCount: 2,
      columns: [
        {
          id: crypto.randomUUID(), cellType: 'signature',
          content: { role: 'Customer', label: 'Customer Completion', description: 'I confirm the move is complete and all items accounted for.' },
        },
        {
          id: crypto.randomUUID(), cellType: 'signature',
          content: { role: 'Technician', label: 'Lead Mover', description: 'I confirm all services have been performed as agreed.' },
        },
      ],
    }, i++),

    // ── TERMS & CONDITIONS ────────────────────────────────
    block('divider', 'neutral', { style: 'dashed' }, i++),

    block('heading', 'neutral', { text: 'Terms & Conditions', level: 'h2' }, i++),

    block('text', 'neutral', {
      text: '1. HOURLY BILLING: Time begins upon crew arrival at the origin and ends when the last item is placed at the destination. Travel time to and from the company depot is not billed.\n\n2. MINIMUM CHARGE: A minimum of 2 hours labor will be billed regardless of actual time worked.\n\n3. PAYMENT: Full payment of the remaining balance is due upon completion. The carrier may hold goods until payment is received in full.\n\n4. LIABILITY: Under Released Value Protection, carrier liability is limited to $0.60 per pound per article. Under Full Value Protection, the carrier will repair, replace, or provide a cash settlement at current market value.\n\n5. CLAIMS: Visible damage must be reported at delivery. Concealed damage must be reported in writing within 9 months. All claims require photographs and itemized documentation.\n\n6. CANCELLATION: Cancellations made less than 48 hours before the scheduled move will forfeit the deposit. Rescheduling within 7 days of the original date incurs no additional fee.\n\n7. DELAYS: The carrier is not responsible for delays caused by weather, traffic, building restrictions, elevator availability, or other circumstances beyond reasonable control.\n\n8. PROHIBITED ITEMS: The carrier will not transport hazardous materials, perishable goods, ammunition, firearms, pets, plants, or items of illegal nature.\n\n9. ACCESS: The customer is responsible for ensuring clear pathways, elevator reservations, parking permits, and building access at both origin and destination.',
    }, i++),

    block('checkbox_list', 'neutral', {
      title: '',
      items: [
        { label: 'I have read and agree to all Terms & Conditions stated above', checked: false },
        { label: 'I acknowledge my selected valuation coverage option', checked: false },
        { label: 'I authorize the carrier to proceed with the move as described', checked: false },
      ],
    }, i++),

    block('signature', 'neutral', {
      role: 'Customer',
      label: 'Terms & Conditions Acceptance',
      description: 'Final acceptance of all contract terms.',
    }, i++),
  ]
}

export const SAMPLE_TEMPLATES = [
  {
    name: 'Moving Service Contract',
    description: 'Professional moving agreement with valuation coverage, time tracking, inspection checklist, and full legal terms',
    category: 'General',
    designTheme: 'clean',
    getBlocks: getMovingContractBlocks,
  },
]
