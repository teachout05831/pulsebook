import type { TranscriptMessage, SalesStage, StageConfig } from '../types'
import { STAGE_CONFIGS, STAGE_ORDER } from '../constants/stagePatterns'

const WINDOW_SIZE = 5
const GREETING_DURATION_MS = 60_000

/**
 * Detects the current sales stage based on recent transcript messages.
 * Stages only advance forward — never regress to an earlier stage.
 * First 60 seconds always stays on 'greeting'.
 */
export function detectStage(
  messages: TranscriptMessage[],
  currentStage: SalesStage,
  callStartTime: number,
  customConfigs?: StageConfig[]
): SalesStage {
  const configs = customConfigs || STAGE_CONFIGS
  if (messages.length === 0) return currentStage

  // Stay on greeting for the first 60 seconds
  const now = Date.now()
  if (now - callStartTime < GREETING_DURATION_MS) return 'greeting'

  // Get last N messages for keyword scanning
  const recentMessages = messages.slice(-WINDOW_SIZE)
  const recentText = recentMessages
    .map((m) => m.text.toLowerCase())
    .join(' ')

  const currentIndex = STAGE_ORDER.indexOf(currentStage)
  let bestStage = currentStage
  let bestIndex = currentIndex

  // Only check stages that are ahead of or equal to current
  for (let i = currentIndex; i < configs.length; i++) {
    const config = configs[i]
    const matched = config.keywords.some((keywordGroup) =>
      keywordGroup.some((keyword) => recentText.includes(keyword))
    )

    if (matched && i > bestIndex) {
      bestStage = config.stage
      bestIndex = i
    }
  }

  return bestStage
}
