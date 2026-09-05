import React from 'react'
import Link from 'next/link'
import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Baby,
  Activity,
  Brain,
  Smile,
  UserCheck,
  ArrowRight,
} from 'lucide-react'
import { Specialty } from '@/types/specialty'
import { Card } from '@/components/ui/Card'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Stethoscope: Stethoscope,
  HeartPulse: HeartPulse,
  Sparkles: Sparkles,
  Baby: Baby,
  Activity: Activity,
  Brain: Brain,
  Smile: Smile,
  UserCheck: UserCheck,
}

export interface SpecialtyCardProps {
  specialty: Specialty
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty }) => {
  const Icon = ICON_MAP[specialty.iconName] || Stethoscope

  return (
    <Link href={`/doctors?specialty=${specialty.slug}`} className="group block focus:outline-none">
      <Card hoverEffect className="h-full flex flex-col justify-between p-6 border-slate-200/90 group-hover:border-brand-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200">
              <Icon className="h-6 w-6 stroke-[2]" />
            </div>
            <span className="text-slate-400 group-hover:text-brand-600 transition-colors">
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
              {specialty.name}
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {specialty.description}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700">
          <span>Find Specialists</span>
          <span className="text-[11px] text-slate-400 font-normal">Online Booking</span>
        </div>
      </Card>
    </Link>
  )
}
