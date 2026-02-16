'use client'

import type { SalesStage } from '../types'
import { STAGE_ORDER, STAGE_CONFIGS } from '../constants/stagePatterns'

interface StageIndicatorProps {
  currentStage: SalesStage
}

export function StageIndicator({ currentStage }: StageIndicatorProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage)
  const config = STAGE_CONFIGS.find((c) => c.stage === currentStage)

  return (
    <div>
      {/* Progress bar with 8 pips */}
      <div className="flex gap-0.5 px-3.5 py-3 border-b border-white/[0.06]">
        {STAGE_ORDER.map((stage, i) => {
          let colorClass = 'bg-white/[0.08]'
          if (i < currentIndex) colorClass = 'bg-green-500'
          if (i === currentIndex) colorClass = 'bg-blue-500 animate-pulse'

          return (
            <div
              key={stage}
              className={`flex-1 h-1 rounded-sm ${colorClass}`}
              title={STAGE_CONFIGS[i].label}
            />
          )
        })}
      </div>

      {/* Stage label */}
      <div className="px-3.5 py-1 pb-2.5 text-[0.65rem] text-white/40 flex justify-between items-center border-b border-white/[0.06]">
        <span>
          Stage {currentIndex + 1} of {STAGE_ORDER.length}
        </span>
        <strong className="text-white text-[0.72rem]">
          {config?.label || currentStage}
        </strong>
      </div>
    </div>
  )
}
