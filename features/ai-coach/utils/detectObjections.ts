import type { TranscriptMessage, ObjectionPattern } from '../types'
import { OBJECTION_PATTERNS } from '../constants/objectionPatterns'

const SCAN_WINDOW = 3

/**
 * Scans recent customer messages for objection patterns.
 * Deduplicates against already-detected objection IDs.
 * Only checks customer messages (isHost=false).
 */
export function detectObjections(
  messages: TranscriptMessage[],
  alreadyDetected: Set<string>,
  customPatterns?: ObjectionPattern[]
): ObjectionPattern[] {
  if (messages.length === 0) return []

  // Only scan customer messages (not host)
  const customerMessages = messages
    .filter((m) => !m.isHost)
    .slice(-SCAN_WINDOW)

  if (customerMessages.length === 0) return []

  const recentText = customerMessages
    .map((m) => m.text.toLowerCase())
    .join(' ')

  const newObjections: ObjectionPattern[] = []

  const patterns = customPatterns || OBJECTION_PATTERNS
  for (const pattern of patterns) {
    // Skip if already detected
    if (alreadyDetected.has(pattern.id)) continue

    const matched = pattern.keywords.some((keyword) =>
      recentText.includes(keyword)
    )

    if (matched) {
      newObjections.push(pattern)
    }
  }

  return newObjections
}
