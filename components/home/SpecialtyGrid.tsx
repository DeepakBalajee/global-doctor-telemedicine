import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SPECIALTIES_DATA } from '@/data/specialties'
import { SpecialtyCard } from './SpecialtyCard'
import { Button } from '@/components/ui/Button'

export const SpecialtyGrid: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Specialized Care
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Find Care by Specialty
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Explore board-certified medical experts across key healthcare domains ready for in-person appointments or online video consultations.
            </p>
          </div>

          <Link href="/specialties" className="shrink-0">
            <Button variant="outline" size="md" className="gap-2 font-semibold">
              View All Specialties <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* SPECIALTIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALTIES_DATA.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>

      </div>
    </section>
  )
}
