import type { StageConfig, SalesStage } from '../types'
import { STAGE_CONFIGS_LATE } from './stageConfigsLate'

export const STAGE_ORDER: SalesStage[] = [
  'greeting',
  'discovery',
  'needs_assessment',
  'solution_presentation',
  'pricing_discussion',
  'objection_handling',
  'closing',
  'wrap_up',
]

export const STAGE_CONFIGS: StageConfig[] = [
  {
    stage: 'greeting',
    label: 'Greeting',
    description: 'Opening and rapport building',
    keywords: [
      ['how are you'],
      ['thanks for joining'],
      ['nice to meet'],
      ['good morning'],
      ['good afternoon'],
      ['welcome'],
    ],
    talkingPoints: [
      'Introduce yourself and your role',
      'Thank them for their time',
      'Set expectations for the call',
      'Build rapport — ask about their day',
    ],
  },
  {
    stage: 'discovery',
    label: 'Discovery',
    description: 'Understanding the situation',
    keywords: [
      ['tell me about'],
      ['what brings you'],
      ['looking for'],
      ['how can we help'],
      ['what do you need'],
      ['describe your'],
    ],
    talkingPoints: [
      'Ask open-ended questions about their situation',
      'Listen for pain points and urgency',
      'Understand their timeline',
      'Note any previous attempts to solve the problem',
    ],
  },
  {
    stage: 'needs_assessment',
    label: 'Needs Assessment',
    description: 'Qualifying scope and specifics',
    keywords: [
      ['how many'],
      ['square feet'],
      ['square foot'],
      ['rooms'],
      ['timeline'],
      ['how often'],
      ['how big'],
      ['how old'],
      ['when was'],
    ],
    talkingPoints: [
      'Quantify the scope of work',
      'Ask about property details (size, age, condition)',
      'Identify any special requirements or access issues',
      'Clarify their ideal timeline for completion',
    ],
  },
  {
    stage: 'solution_presentation',
    label: 'Solution',
    description: 'Presenting your services',
    keywords: [
      ['we offer'],
      ['our process'],
      ['what we do'],
      ['includes'],
      ['our team'],
      ['we specialize'],
      ['our approach'],
    ],
    talkingPoints: [
      'Present your recommended solution',
      'Explain your process step-by-step',
      'Highlight what makes you different',
      'Share relevant experience and credentials',
    ],
  },
  ...STAGE_CONFIGS_LATE,
]
