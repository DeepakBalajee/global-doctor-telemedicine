import React from 'react'
import {
  Shield,
  Key,
  UserCheck,
  FileLock,
  ClipboardList,
  CreditCard,
  Lock,
} from 'lucide-react'
import { SECURITY_PRINCIPLES } from '@/data/security'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Shield: Shield,
  Key: Key,
  UserCheck: UserCheck,
  FileLock: FileLock,
  ClipboardList: ClipboardList,
  CreditCard: CreditCard,
  Lock: Lock,
}

export const SecuritySection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Trust & Architecture
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built With Privacy and Security in Mind
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Designed to support applicable healthcare privacy and security requirements through rigorous architectural isolation, encryption, and access controls.
          </p>
        </div>

        {/* SECURITY PRINCIPLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_PRINCIPLES.map((item) => {
            const Icon = ICON_MAP[item.iconName] || Shield

            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* ADMINISTRATIVE SECURITY DISCLAIMER NOTICE */}
        <div className="mt-12 p-4 rounded-xl bg-brand-50/70 border border-brand-100 max-w-4xl mx-auto text-center space-y-1">
          <p className="text-xs font-semibold text-brand-900">
            Strict Multi-Tier Administrative Boundary Isolation
          </p>
          <p className="text-xs text-brand-700">
            Super Admin system management and Admin Head Member operations operate on fully decoupled authentication and authorization boundaries with mandatory MFA and immutable audit tracking.
          </p>
        </div>

      </div>
    </section>
  )
}
