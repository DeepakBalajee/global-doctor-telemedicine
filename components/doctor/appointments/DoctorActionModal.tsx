'use client'

import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Button } from '@/components/ui/Button'

export interface DoctorActionModalProps {
  isOpen: boolean
  appointment: PatientAppointmentDetail | null
  action: 'complete' | 'cancel' | null
  onClose: () => void
  onConfirmAction: (action: 'complete' | 'cancel', reason?: string) => Promise<void>
}

export const DoctorActionModal: React.FC<DoctorActionModalProps> = ({
  isOpen,
  appointment,
  action,
  onClose,
  onConfirmAction,
}) => {
  const [reason, setReason] = useState('Emergency schedule conflict')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !appointment || !action) return null

  const isComplete = action === 'complete'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onConfirmAction(action, isComplete ? undefined : reason)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isComplete ? 'Mark Consultation Completed?' : 'Cancel Doctor Appointment?'}
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <strong>{appointment.patientName}</strong> ({appointment.appointmentDate} at {appointment.startTime})
              </p>
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

        {/* FORM / REASON */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isComplete && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Reason for Doctor Cancellation *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="Emergency schedule conflict">Emergency schedule conflict</option>
                <option value="Doctor unavailable at requested time">Doctor unavailable at requested time</option>
                <option value="Referred patient to emergency care">Referred patient to emergency care</option>
                <option value="Other clinical reason">Other clinical reason</option>
              </select>
            </div>
          )}

          {isComplete && (
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Confirm that you have completed the consultation session with <strong>{appointment.patientName}</strong>.
            </p>
          )}

          {/* BUTTON ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="text-xs font-semibold"
            >
              Back
            </Button>

            <Button
              type="submit"
              variant={isComplete ? 'teal' : 'primary'}
              size="md"
              disabled={isSubmitting}
              className={`text-xs font-bold gap-1.5 ${!isComplete ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
            >
              {isSubmitting
                ? 'Updating...'
                : isComplete
                ? 'Confirm Session Completed'
                : 'Confirm Cancellation'}
            </Button>
          </div>
        </form>

      </div>

    </div>
  )
}
