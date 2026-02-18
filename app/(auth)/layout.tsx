import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-8 text-center">
        <Link href="/">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Pulsebook<span className="text-blue-400">.co</span>
          </h1>
        </Link>
        <p className="mt-2 text-sm text-slate-400">Service business management platform</p>
      </div>
      {children}
    </div>
  )
}
