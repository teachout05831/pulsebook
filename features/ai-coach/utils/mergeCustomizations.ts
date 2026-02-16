import type { CoachingSuggestion, SalesStage, StageConfig, ObjectionPattern, CoachLibraryCustomization } from '../types'
import { COACHING_CARDS } from '../constants/coachingLibrary'
import { STAGE_CONFIGS } from '../constants/stagePatterns'
import { OBJECTION_PATTERNS } from '../constants/objectionPatterns'

/**
 * Merge default coaching cards with company overrides.
 * Override fields REPLACE defaults (title, body, scriptText).
 * Unoverridden cards use defaults unchanged.
 */
export function mergeCoachingCards(
  custom: CoachLibraryCustomization | null
): Record<SalesStage, CoachingSuggestion[]> {
  if (!custom) return COACHING_CARDS

  const merged = { ...COACHING_CARDS }
  for (const [stage, override] of Object.entries(custom.stageOverrides)) {
    if (!override?.cards?.length) continue
    const defaults = merged[stage as SalesStage] || []
    merged[stage as SalesStage] = defaults.map((card) => {
      const ov = override.cards!.find((c) => c.id === card.id)
      if (!ov) return card
      return {
        ...card,
        title: ov.title ?? card.title,
        body: ov.body ?? card.body,
        scriptText: ov.scriptText ?? card.scriptText,
      }
    })
  }
  return merged
}

/**
 * Merge default stage configs with extra keywords.
 * Extra keywords ADD to defaults (never remove).
 */
export function mergeStageConfigs(
  custom: CoachLibraryCustomization | null
): StageConfig[] {
  if (!custom) return STAGE_CONFIGS

  return STAGE_CONFIGS.map((config) => {
    const ov = custom.stageOverrides[config.stage]
    if (!ov) return config
    const disabled = ov.disabledKeywords || []
    let keywords = config.keywords
    if (disabled.length) {
      keywords = keywords.map((group) => group.filter((kw) => !disabled.includes(kw))).filter((g) => g.length > 0)
    }
    if (ov.extraKeywords?.length) {
      keywords = [...keywords, ...ov.extraKeywords]
    }
    return { ...config, keywords }
  })
}

/**
 * Merge default objection patterns with overrides + custom objections.
 * Override response/alternateResponses REPLACE defaults.
 * Custom objections APPEND to the list.
 */
export function mergeObjectionPatterns(
  custom: CoachLibraryCustomization | null
): ObjectionPattern[] {
  if (!custom) return OBJECTION_PATTERNS

  const merged = OBJECTION_PATTERNS.map((pattern) => {
    const ov = custom.objectionOverrides[pattern.id]
    if (!ov) return pattern
    let keywords = pattern.keywords
    if (ov.disabledKeywords?.length) {
      keywords = keywords.filter((kw) => !ov.disabledKeywords!.includes(kw))
    }
    if (ov.extraKeywords?.length) {
      keywords = [...keywords, ...ov.extraKeywords]
    }
    return {
      ...pattern,
      keywords,
      response: ov.response ?? pattern.response,
      alternateResponses: ov.alternateResponses ?? pattern.alternateResponses,
    }
  })

  for (const co of custom.customObjections) {
    merged.push(co)
  }

  return merged
}
