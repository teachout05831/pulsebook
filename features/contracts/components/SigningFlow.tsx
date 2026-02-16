'use client'

import { Loader2 } from 'lucide-react'
import { useContractSigning } from '../hooks/useContractSigning'
import { SigningReview } from './SigningReview'
import { SigningPricing } from './SigningPricing'
import { SigningTerms } from './SigningTerms'
import { SigningSignature } from './SigningSignature'
import { SigningComplete } from './SigningComplete'

interface Props {
  token: string
}

const STEP_LABELS = ['Review', 'Pricing', 'Terms', 'Sign', 'Done']

export function SigningFlow({ token }: Props) {
  const {
    contract, isLoading, error, step, stepIndex,
    stepCount, nextStep, prevStep, submitSignature, isSubmitting,
  } = useContractSigning(token)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-destructive">Contract Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {error || 'This signing link may be invalid or expired.'}
        </p>
      </div>
    )
  }

  const name = contract.templateSnapshot?.name || 'Contract'

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {step !== 'complete' && (
        <div className="flex items-center gap-1 mb-6">
          {STEP_LABELS.slice(0, -1).map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
              <p className={`text-[10px] mt-1 text-center ${
                i === stepIndex ? 'text-blue-600 font-medium' : 'text-muted-foreground'
              }`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {step === 'review' && <SigningReview contract={contract} onNext={nextStep} />}
      {step === 'pricing' && <SigningPricing contract={contract} onNext={nextStep} onBack={prevStep} />}
      {step === 'terms' && <SigningTerms contract={contract} onNext={nextStep} onBack={prevStep} />}
      {step === 'signature' && (
        <SigningSignature
          contract={contract}
          onSubmit={submitSignature}
          isSubmitting={isSubmitting}
          onBack={prevStep}
        />
      )}
      {step === 'complete' && <SigningComplete contractName={name} />}
    </div>
  )
}
