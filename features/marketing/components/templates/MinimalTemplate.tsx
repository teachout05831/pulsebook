'use client'

import { MarketingNav } from '../MarketingNav'
import { MarketingFooter } from '../MarketingFooter'
import { ContactFormDialog } from '../ContactFormDialog'
import { FeatureIcon } from '../FeatureIcon'
import type { TemplateProps } from '../../types'

export function MinimalTemplate({ features }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav variant="light" />

      {/* Hero */}
      <section className="px-6 py-32 md:py-48">
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-black md:text-7xl">
            Service management, simplified.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-500">
            One platform for scheduling, estimates, payments, and everything in between.
          </p>
          <div className="mt-10">
            <ContactFormDialog triggerClassName="h-12 rounded-full px-8 text-base" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-neutral-200 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={
                'grid items-start gap-4 py-6 md:grid-cols-3' +
                (i < features.length - 1 ? ' border-b border-neutral-200' : '')
              }
            >
              <div className="flex items-center gap-3">
                <FeatureIcon name={feature.icon} className="h-4 w-4 text-blue-600" />
                <h3 className="text-lg font-semibold text-black">{feature.title}</h3>
              </div>
              <p className="text-neutral-500 md:col-span-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-bold text-black">Interested?</h2>
          <p className="mb-8 text-neutral-500">We&#39;d love to show you around.</p>
          <ContactFormDialog triggerClassName="h-12 rounded-full px-8 text-base" />
        </div>
      </section>

      <MarketingFooter variant="light" />
    </div>
  )
}
