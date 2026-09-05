import React from 'react'
import { BadgeCheck, ShieldCheck, Lock, CreditCard } from 'lucide-react'
import { TRUST_INDICATORS_DATA } from '@/data/trust-indicators'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BadgeCheck: BadgeCheck,
  ShieldCheck: ShieldCheck,
  Lock: Lock,
  CreditCard: CreditCard,
}

export const TrustIndicators: React.FC = () => {
  return (
    <section className="py-10 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_INDICATORS_DATA.map((item) => {
            const Icon = ICON_MAP[item.iconName] || BadgeCheck

            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100 transition-colors hover:bg-slate-100/80"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 border border-brand-100">
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-snug">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
