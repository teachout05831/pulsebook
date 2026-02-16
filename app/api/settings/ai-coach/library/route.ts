import { NextRequest, NextResponse } from 'next/server'
import { getCoachLibrary } from '@/features/ai-coach/queries/getCoachLibrary'
import { updateCoachLibrary } from '@/features/ai-coach/actions/updateCoachLibrary'

type R = Record<string, unknown>
const EMPTY = { companyContext: '', stageOverrides: {}, objectionOverrides: {}, customObjections: [] }

// snake_case JSONB → camelCase response
function toClient(raw: R) {
  if (!raw || Object.keys(raw).length === 0) return EMPTY
  const stages: R = {}
  for (const [s, ov] of Object.entries((raw.stage_overrides || {}) as Record<string, R>)) {
    stages[s] = {
      cards: Array.isArray(ov.cards)
        ? (ov.cards as R[]).map((c) => ({ id: c.id, title: c.title, body: c.body, scriptText: c.script_text }))
        : undefined,
      extraKeywords: ov.extra_keywords,
      disabledKeywords: ov.disabled_keywords,
    }
  }
  const objs: R = {}
  for (const [id, ov] of Object.entries((raw.objection_overrides || {}) as Record<string, R>)) {
    objs[id] = { response: ov.response, alternateResponses: ov.alternate_responses, extraKeywords: ov.extra_keywords, disabledKeywords: ov.disabled_keywords }
  }
  const custom = Array.isArray(raw.custom_objections)
    ? (raw.custom_objections as R[]).map((c) => ({
        id: c.id, keywords: c.keywords, category: c.category,
        response: c.response, alternateResponses: c.alternate_responses,
      }))
    : []
  return { companyContext: raw.company_context || '', stageOverrides: stages, objectionOverrides: objs, customObjections: custom }
}

// camelCase request → snake_case JSONB
function toDb(body: R): R {
  const stages: R = {}
  for (const [s, ov] of Object.entries((body.stageOverrides || {}) as Record<string, R>)) {
    stages[s] = {
      cards: Array.isArray(ov.cards)
        ? (ov.cards as R[]).map((c) => ({ id: c.id, title: c.title, body: c.body, script_text: c.scriptText }))
        : undefined,
      extra_keywords: ov.extraKeywords,
      disabled_keywords: ov.disabledKeywords,
    }
  }
  const objs: R = {}
  for (const [id, ov] of Object.entries((body.objectionOverrides || {}) as Record<string, R>)) {
    objs[id] = { response: ov.response, alternate_responses: ov.alternateResponses, extra_keywords: ov.extraKeywords, disabled_keywords: ov.disabledKeywords }
  }
  const custom = Array.isArray(body.customObjections)
    ? (body.customObjections as R[]).map((c) => ({
        id: c.id, keywords: c.keywords, category: c.category,
        response: c.response, alternate_responses: c.alternateResponses,
      }))
    : []
  return { company_context: body.companyContext || '', stage_overrides: stages, objection_overrides: objs, custom_objections: custom }
}

// GET /api/settings/ai-coach/library
export async function GET() {
  try {
    const raw = await getCoachLibrary()
    return NextResponse.json(toClient(raw as R), {
      headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=120' }
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

// PUT /api/settings/ai-coach/library
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await updateCoachLibrary(toDb(body))
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
