'use client'

import { CheckCircle2 } from 'lucide-react'

interface Props {
  contractName: string
}

export function SigningComplete({ contractName }: Props) {
  return (
    <div className="text-center py-8 space-y-4">
      <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
      <div>
        <h2 className="text-xl font-semibold">Contract Signed</h2>
        <p className="text-sm text-muted-foreground mt-1">
          You have successfully signed {contractName}.
        </p>
      </div>
      <div className="border rounded-lg p-4 bg-green-50 text-sm text-green-800">
        <p>A confirmation will be sent to your email address.</p>
        <p className="mt-1">You can safely close this page.</p>
      </div>
    </div>
  )
}
