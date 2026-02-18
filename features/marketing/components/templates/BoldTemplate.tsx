'use client'

import { MarketingNav } from '../MarketingNav'
import { MarketingFooter } from '../MarketingFooter'
import { ContactFormDialog } from '../ContactFormDialog'
import { FeatureIcon } from '../FeatureIcon'
import type { TemplateProps } from '../../types'

export function BoldTemplate({ features }: TemplateProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <MarketingNav variant="dark" />

      {/* Hero */}
      <section className="px-6 py-28 text-center md:py-40">
        <div className="mx-auto max-w-4xl">
          <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            Your service business, supercharged
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            One platform to schedule, estimate, dispatch, and get paid.
            Built for teams that move fast.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <ContactFormDialog triggerClassName="h-12 px-8 text-base bg-blue-500 hover:bg-blue-400" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-white">
            Built for every part of your workflow
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-blue-500/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                  <FeatureIcon name={feature.icon} className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">See it in action</h2>
        <p className="mb-8 text-slate-400">Book a walkthrough with our team.</p>
        <ContactFormDialog triggerClassName="h-12 px-8 text-base bg-blue-500 hover:bg-blue-400" />
      </section>

      <MarketingFooter variant="dark" />
    </div>
  )
}
