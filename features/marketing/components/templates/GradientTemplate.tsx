'use client'

import { MarketingNav } from '../MarketingNav'
import { MarketingFooter } from '../MarketingFooter'
import { ContactFormDialog } from '../ContactFormDialog'
import { FeatureIcon } from '../FeatureIcon'
import type { TemplateProps } from '../../types'

export function GradientTemplate({ features }: TemplateProps) {
  return (
    <div className="min-h-screen">
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <MarketingNav variant="transparent" />

        <section className="px-6 py-28 text-center md:py-36">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              The platform your service business deserves
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              From first call to final payment — manage every step with Pulsebook.
            </p>
            <div className="mt-10">
              <ContactFormDialog
                triggerClassName="h-12 px-8 text-base bg-white text-indigo-700 hover:bg-white/90"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Features */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
            What Pulsebook does
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                  <FeatureIcon name={feature.icon} className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Let&#39;s talk</h2>
        <p className="mb-8 text-slate-600">See how Pulsebook fits your business.</p>
        <ContactFormDialog triggerClassName="h-12 px-8 text-base" />
      </section>

      <MarketingFooter variant="light" />
    </div>
  )
}
