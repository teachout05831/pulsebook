'use client'

import { MarketingNav } from '../MarketingNav'
import { MarketingFooter } from '../MarketingFooter'
import { ContactFormDialog } from '../ContactFormDialog'
import { FeatureIcon } from '../FeatureIcon'
import type { TemplateProps } from '../../types'

export function ClassicTemplate({ features }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav variant="light" />

      {/* Hero */}
      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Run your service business from one platform
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Scheduling, estimates, payments, crew management, and more — all in one place.
            Built for service businesses that want to grow.
          </p>
          <div className="mt-10">
            <ContactFormDialog triggerClassName="h-12 px-8 text-base" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
            Everything you need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <FeatureIcon name={feature.icon} className="mb-4 h-6 w-6 text-blue-600" />
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Ready to get started?</h2>
        <p className="mb-8 text-slate-600">See how Pulsebook can streamline your operations.</p>
        <ContactFormDialog triggerClassName="h-12 px-8 text-base" />
      </section>

      <MarketingFooter variant="light" />
    </div>
  )
}
