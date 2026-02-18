import {
  Document, Page, Text, View, StyleSheet, Image,
} from '@react-pdf/renderer'
import type { ContractBlock, ContractInstance } from '../types'

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', lineHeight: 1.4 },
  header: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#6B7280' },
  block: { marginBottom: 12, padding: 8 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  subheading: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 11 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 4 },
  cell: { flex: 1, fontSize: 10 },
  cellRight: { flex: 1, fontSize: 10, textAlign: 'right' },
  totalRow: { flexDirection: 'row', paddingVertical: 6, borderTopWidth: 2, borderTopColor: '#111827' },
  callout: { padding: 10, backgroundColor: '#FEF3C7', borderRadius: 4, marginBottom: 8 },
  sigArea: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#D1D5DB', paddingTop: 8 },
  sigImage: { width: 200, height: 60, marginBottom: 4 },
  sigMeta: { fontSize: 8, color: '#9CA3AF' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, color: '#9CA3AF', textAlign: 'center' },
  cols: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
})

function renderBlock(block: ContractBlock, signatures: Record<string, string>) {
  const c = block.content
  switch (block.type) {
    case 'heading': {
      const level = (c.level as string) || 'h1'
      const style = level === 'h1' ? s.heading : s.subheading
      return <Text style={style}>{(c.text as string) || ''}</Text>
    }
    case 'text':
      return <Text style={s.text}>{(c.text as string) || ''}</Text>
    case 'column_layout': {
      const cols = (c.columns as Array<{ cellType: string; content: Record<string, unknown> }>) || []
      return (
        <View style={s.cols}>
          {cols.map((col, i) => (
            <View key={`col-${i}`} style={s.col}>
              <Text style={s.text}>{(col.content.text as string) || (col.content.label as string) || ''}</Text>
            </View>
          ))}
        </View>
      )
    }
    case 'pricing_table': {
      const items = (c.items as Array<{ name: string; qty: number; rate: number }>) || []
      const total = items.reduce((sum, i) => sum + i.qty * i.rate, 0)
      return (
        <View>
          <View style={s.row}>
            <Text style={[s.cell, { fontWeight: 'bold' }]}>Item</Text>
            <Text style={[s.cellRight, { fontWeight: 'bold' }]}>Qty</Text>
            <Text style={[s.cellRight, { fontWeight: 'bold' }]}>Rate</Text>
            <Text style={[s.cellRight, { fontWeight: 'bold' }]}>Total</Text>
          </View>
          {items.map((item, i) => (
            <View key={`item-${item.name}-${i}`} style={s.row}>
              <Text style={s.cell}>{item.name}</Text>
              <Text style={s.cellRight}>{item.qty}</Text>
              <Text style={s.cellRight}>${item.rate.toFixed(2)}</Text>
              <Text style={s.cellRight}>${(item.qty * item.rate).toFixed(2)}</Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={s.cell} /><Text style={s.cellRight} /><Text style={[s.cellRight, { fontWeight: 'bold' }]}>Total</Text>
            <Text style={[s.cellRight, { fontWeight: 'bold' }]}>${total.toFixed(2)}</Text>
          </View>
        </View>
      )
    }
    case 'callout':
      return <View style={s.callout}><Text style={s.text}>{(c.text as string) || ''}</Text></View>
    case 'signature': {
      const sigData = signatures[block.id]
      const desc = (c.description as string) || ''
      return (
        <View style={s.sigArea} wrap={false}>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>{(c.label as string) || (c.role as string) || 'Signature'} ({(c.role as string) || 'Customer'})</Text>
          {desc && <Text style={[s.text, { marginBottom: 6 }]}>{desc}</Text>}
          {sigData ? <Image src={sigData} style={s.sigImage} /> : <Text style={s.text}>___________________________</Text>}
          {(c.signedAt as string) && <Text style={s.sigMeta}>Signed {new Date(c.signedAt as string).toLocaleString()}</Text>}
        </View>
      )
    }
    case 'status_tracker': {
      const steps = (c.steps as string[]) || []
      const events = (c.events as Array<{ stepLabel: string; timestamp: string }>) || []
      return (
        <View>
          <Text style={[s.text, { fontWeight: 'bold', marginBottom: 4 }]}>Status</Text>
          {steps.map((step, i) => {
            const ev = events.find(e => e.stepLabel === step)
            return (
              <Text key={`status-${step}-${i}`} style={s.text}>
                {ev ? '✓' : '○'} {step}{ev ? ` — ${new Date(ev.timestamp).toLocaleString()}` : ''}
              </Text>
            )
          })}
        </View>
      )
    }
    default:
      return null
  }
}

interface Props {
  instance: ContractInstance
  signatures?: Record<string, string>
}

export function ContractPDF({ instance, signatures = {} }: Props) {
  const blocks = instance.filledBlocks || []
  const name = instance.templateSnapshot?.name || 'Contract'

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>{name}</Text>
          <Text style={s.subtitle}>Contract #{instance.id.slice(0, 8)} — {new Date(instance.createdAt).toLocaleDateString()}</Text>
        </View>
        {blocks.map((block) => (
          <View key={block.id} style={s.block} wrap={false}>{renderBlock(block, signatures)}</View>
        ))}
        <Text style={s.footer}>Generated by Pulsebook — {new Date().toLocaleString()}</Text>
      </Page>
    </Document>
  )
}
