'use client'

import React, { useState } from 'react'
import { AlertTriangle, X, Calendar, Clock, Stethoscope } from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Button } from '@/components/ui/Button'

export interface CancelAppointmentModalProps {
  isOpen: boolean
  appointment: PatientAppointmentDetail | null
  onClose: () => void
  onConfirmCancel: (reason: string) => Promise<void>
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('Personal schedule conflict')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !appointment) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onConfirmCancel(reason)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Cancel Appointment?</h3>
              <p className="text-xs text-slate-500">This action will release the slot back to doctor availability.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* APPOINTMENT SUMMARY BOX */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>{appointment.doctorName}</span>
          </div>
          <div className="text-slate-600 font-semibold pl-6">
            {appointment.doctorType === 'SPECIALIST' ? `Specialist (${appointment.specialtyName})` : 'General Physician'}
          </div>
          <div className="flex items-center gap-4 text-slate-500 pl-6 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {appointment.appointmentDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {appointment.startTime}
            </span>
          </div>
        </div>

        {/* CANCELLATION REASON FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Reason for Cancellation *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="Personal schedule conflict">Personal schedule conflict</option>
              <option value="Symptoms improved / No longer required">Symptoms improved / No longer required</option>
              <option value="Booking error / Selected wrong date">Booking error / Selected wrong date</option>
              <option value="Switching to local doctor visit">Switching to local doctor visit</option>
              <option value="Other reason">Other reason</option>
            </select>
          </div>

          {/* BUTTON ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="text-xs font-semibold"
            >
              Keep Appointment
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </form>

      </div>

    </div>
  )
}
