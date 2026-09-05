import React from 'react'
import { Video, Phone, Building2, MessageSquare } from 'lucide-react'
import { ConsultationType } from '@/types/patient'
import { cn } from '@/lib/utils'

export interface ConsultationTypeOption {
  type: ConsultationType
  title: string
  subtitle: string
  icon: React.FC<{ className?: string }>
  badge?: string
}

const OPTIONS: ConsultationTypeOption[] = [
  {
    type: 'ONLINE_VIDEO',
    title: 'Online — Video Call',
    subtitle: 'Browser-based HD video consultation',
    icon: Video,
    badge: 'Popular',
  },
  {
    type: 'ONLINE_AUDIO',
    title: 'Online — Audio Call',
    subtitle: 'Private browser audio call',
    icon: Phone,
  },
  {
    type: 'OFFLINE',
    title: 'Offline Consultation',
    subtitle: 'In-person clinic visit',
    icon: Building2,
  },
  {
    type: 'CHAT',
    title: 'Chat Consultation',
    subtitle: 'Secure messaging (if supported)',
    icon: MessageSquare,
    badge: 'If Doctor Supported',
  },
]

export interface ConsultationTypeSelectorProps {
  value: ConsultationType
  onChange: (type: ConsultationType) => void
  disabled?: boolean
}

export const ConsultationTypeSelector: React.FC<ConsultationTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        Consultation Type <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          const isSelected = value === opt.type

          return (
            <button
              key={opt.type}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.type)}
              className={cn(
                'relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                isSelected
                  ? 'bg-brand-50/70 border-brand-500 text-brand-900 shadow-sm ring-1 ring-brand-500'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                )}
              >
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold truncate">{opt.title}</span>
                  {opt.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 shrink-0">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{opt.subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
