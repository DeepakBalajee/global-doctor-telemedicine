import React from 'react'
import Link from 'next/link'
import { ArrowRight, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-brand-50/40 to-slate-50 relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-600/30">
            <Activity className="h-8 w-8 stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Start Your Healthcare Journey Today
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Join thousands of patients accessing verified specialist care online or find the right doctor for an in-person consultation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/patient/doctors" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-lg shadow-brand-600/20">
              Find a Doctor <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/patient/register" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}
