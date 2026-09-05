import React from 'react'
import {
  Clock,
  Video,
  FileText,
  FolderLock,
  Calendar,
  Bell,
} from 'lucide-react'
import { PATIENT_FEATURES_DATA } from '@/data/features'
import { Card } from '@/components/ui/Card'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Clock: Clock,
  Video: Video,
  FileText: FileText,
  FolderLock: FolderLock,
  Calendar: Calendar,
  Bell: Bell,
}

export const FeatureSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Patient Experience
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need for Better Care
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Built from the ground up to provide a stress-free healthcare journey for patients and families.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PATIENT_FEATURES_DATA.map((feature) => {
            const Icon = ICON_MAP[feature.iconName] || Clock

            return (
              <Card
                key={feature.id}
                hoverEffect
                className="flex flex-col justify-between p-6 border-slate-200/90"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>
                    {feature.tag && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-100">
                        {feature.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-brand-600 flex items-center justify-between">
                  <span>Learn more</span>
                  <span className="text-slate-400">→</span>
                </div>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
