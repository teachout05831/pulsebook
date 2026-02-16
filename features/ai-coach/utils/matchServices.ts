import type { TranscriptMessage, CoachCatalogItem } from '../types'

const SCAN_WINDOW = 5
const MAX_MATCHES = 2

/**
 * Matches transcript text against the service/materials catalog.
 * Uses simple word matching: item.name words + item.keywords array.
 * Deduplicates against already-suggested service IDs.
 * Returns max 2 new matches per scan.
 */
export function matchServices(
  messages: TranscriptMessage[],
  catalog: CoachCatalogItem[],
  alreadySuggested: Set<string>
): CoachCatalogItem[] {
  if (messages.length === 0 || catalog.length === 0) return []

  const recentMessages = messages.slice(-SCAN_WINDOW)
  const recentText = recentMessages
    .map((m) => m.text.toLowerCase())
    .join(' ')

  const matches: CoachCatalogItem[] = []

  for (const item of catalog) {
    if (matches.length >= MAX_MATCHES) break
    if (alreadySuggested.has(item.id)) continue

    // Check item keywords against recent text
    const keywordMatch = item.keywords.some((keyword) =>
      recentText.includes(keyword.toLowerCase())
    )

    // Also check item name words (2+ char words only)
    const nameWords = item.name
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
    const nameMatch = nameWords.some((word) => recentText.includes(word))

    if (keywordMatch || nameMatch) {
      matches.push(item)
    }
  }

  return matches
}
