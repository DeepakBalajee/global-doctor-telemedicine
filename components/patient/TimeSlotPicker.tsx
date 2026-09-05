'use client'

import React from 'react'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { GeneratedAppointmentSlot } from '@/types/availability'
import { cn } from '@/lib/utils'

export interface TimeSlotPickerProps {
  slots: GeneratedAppointmentSlot[]
  selectedSlotId: string | null
  onSelectSlot: (slot: GeneratedAppointmentSlot) => void
  isLoading?: boolean
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Calculating available doctor slots...
      </div>
    )
  }

  if (!slots.length) {
    return (
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
        No available consultation slots for this date. Please select another date.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span>Available Time Slots ({slots.filter((s) => s.isAvailable).length})</span>
        <span className="text-[11px] text-slate-400 font-normal">Fee: ₹5.00 INR (Server Fixed)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.slotId

          return (
            <button
              key={slot.slotId}
              type="button"
              disabled={!slot.isAvailable}
              onClick={() => onSelectSlot(slot)}
              className={cn(
                'p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                !slot.isAvailable
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  : isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-600'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-teal-500 hover:bg-teal-50/50'
              )}
            >
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{slot.startTime}</span>
              </div>

              {!slot.isAvailable ? (
                <span className="text-[10px] font-semibold text-red-500">Booked</span>
              ) : isSelected ? (
                <span className="text-[10px] font-semibold text-teal-100">Selected</span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-600">Available</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
