import React from 'react'
import { Search, CalendarCheck, Video, FileCheck, ArrowRight } from 'lucide-react'
import { HOW_IT_WORKS_STEPS } from '@/data/how-it-works'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Search: Search,
  CalendarCheck: CalendarCheck,
  Video: Video,
  FileCheck: FileCheck,
}

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Simple Process
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Healthcare in Four Simple Steps
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Experience seamless medical consultation from initial specialist discovery to post-consultation care management.
          </p>
        </div>

        {/* STEPS GRID WITH TIMELINE CONNECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const Icon = ICON_MAP[step.iconName] || Search

            return (
              <div
                key={step.stepNumber}
                className="relative bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 transition-all duration-200 hover:shadow-card hover:bg-white flex flex-col justify-between"
              >
                <div>
                  {/* STEP NUMBER & ICON */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                      STEP {step.stepNumber}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs font-semibold text-brand-700 mt-1">{step.subtitle}</p>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
