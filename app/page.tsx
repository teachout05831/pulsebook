import { LoginForm } from '@/features/auth'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Pulsebook<span className="text-blue-600">.ai</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">Service business management platform</p>
      </div>
      <LoginForm />
    </div>
  )
}
