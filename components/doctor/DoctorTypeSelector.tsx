import React from 'react'
import { Stethoscope, Award, CheckCircle2 } from 'lucide-react'
import { DoctorType } from '@/types/doctor'
import { SPECIALTIES_DATA } from '@/data/specialties'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'

export interface DoctorTypeSelectorProps {
  doctorType: DoctorType
  selectedSpecialtyId: string
  onDoctorTypeChange: (type: DoctorType) => void
  onSpecialtyChange: (specialtyId: string) => void
  disabled?: boolean
  error?: string
}

export const DoctorTypeSelector: React.FC<DoctorTypeSelectorProps> = ({
  doctorType,
  selectedSpecialtyId,
  onDoctorTypeChange,
  onSpecialtyChange,
  disabled = false,
  error,
}) => {
  const specialtyOptions = [
    { value: '', label: '-- Select Specialization --' },
    ...SPECIALTIES_DATA.map((s) => ({ value: s.id, label: s.name })),
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Doctor Category <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500">
          Select whether you practice as a General Physician or a Medical Specialist.
        </p>
      </div>

      {/* MUTUALLY EXCLUSIVE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* GENERAL PHYSICIAN */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDoctorTypeChange('GENERAL_PHYSICIAN')}
          className={cn(
            'relative flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            doctorType === 'GENERAL_PHYSICIAN'
              ? 'bg-brand-50/80 border-brand-500 text-brand-950 shadow-md ring-1 ring-brand-500'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors',
              doctorType === 'GENERAL_PHYSICIAN'
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            )}
          >
            <Stethoscope className="h-6 w-6 stroke-[2]" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold">General Physician</span>
              {doctorType === 'GENERAL_PHYSICIAN' && (
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provides primary healthcare, routine checkups, fever/illness evaluation, and general medical consultation.
            </p>
          </div>
        </button>

        {/* SPECIALIST */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDoctorTypeChange('SPECIALIST')}
          className={cn(
            'relative flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
            doctorType === 'SPECIALIST'
              ? 'bg-teal-50/80 border-teal-500 text-teal-950 shadow-md ring-1 ring-teal-500'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors',
              doctorType === 'SPECIALIST'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            )}
          >
            <Award className="h-6 w-6 stroke-[2]" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold">Specialist</span>
              {doctorType === 'SPECIALIST' && (
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Practices in a specialized medical domain (e.g. Cardiology, Dermatology, Pediatrics, Neurology).
            </p>
          </div>
        </button>

      </div>

      {/* CONDITIONAL SPECIALTY SELECTOR FOR SPECIALIST */}
      {doctorType === 'SPECIALIST' && (
        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-2 animate-in fade-in duration-200">
          <Select
            label="Specialization *"
            options={specialtyOptions}
            value={selectedSpecialtyId}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            disabled={disabled}
            error={error}
            icon={<Award className="w-4 h-4 text-teal-600" />}
          />
          <p className="text-[11px] text-teal-700 font-medium">
            Specialization list is centrally managed to match patient specialty searches accurately.
          </p>
        </div>
      )}

    </div>
  )
}
