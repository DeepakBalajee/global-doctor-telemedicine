'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  FileText,
} from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CancelAppointmentModal } from './CancelAppointmentModal'
import {
  getPatientAppointmentDetail,
  cancelPatientAppointment,
} from '@/lib/patient/patient-appointment-client'

export interface AppointmentDetailsViewProps {
  appointmentId: string
}

export const AppointmentDetailsView: React.FC<AppointmentDetailsViewProps> = ({
  appointmentId,
}) => {
  const [appointment, setAppointment] = useState<PatientAppointmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true)
      const res = await getPatientAppointmentDetail(appointmentId)
      if (res) {
        setAppointment(res)
      }
      setIsLoading(false)
    }
    loadDetail()
  }, [appointmentId])

  const handleConfirmCancel = async (reason: string) => {
    setMessage(null)
    const res = await cancelPatientAppointment(appointmentId, reason)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Appointment cancelled successfully.' })
      // Reload updated appointment
      const updated = await getPatientAppointmentDetail(appointmentId)
      if (updated) setAppointment(updated)
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to cancel appointment.' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading appointment details...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Appointment Not Found</h3>
        <p className="text-xs text-slate-500">The requested appointment could not be retrieved or you do not have permission to view it.</p>
        <Link href="/patient/appointments">
          <Button variant="teal" size="sm">Back to Appointments</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* BACK LINK */}
      <Link href="/patient/appointments" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700">
        <ArrowLeft className="w-4 h-4" /> Back to My Appointments
      </Link>

      {/* MESSAGE BANNER */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* MAIN APPOINTMENT CARD */}
      <Card className="p-6 sm:p-8 border-slate-200 bg-white rounded-2xl space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-500">Ref: {appointment.id}</span>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                {appointment.appointmentStatus}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Consultation Details
            </h1>
          </div>

          {appointment.isCancellable && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200"
            >
              Cancel Appointment
            </Button>
          )}
        </div>

        {/* DOCTOR SUMMARY */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white font-bold">
              <Stethoscope className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-extrabold text-slate-900">{appointment.doctorName}</h3>
              <p className="text-xs font-semibold text-teal-700">
                {appointment.doctorType === 'SPECIALIST' ? `Specialist (${appointment.specialtyName})` : 'General Physician'}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>Mode: <strong>{appointment.consultationType}</strong></p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Date & Time</span>
            <p className="font-bold text-slate-900">{appointment.appointmentDate}</p>
            <p className="text-slate-500 font-semibold">{appointment.startTime} – {appointment.endTime}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Fee & Payment</span>
            <p className="font-bold text-emerald-700">₹{appointment.feeInINR}.00 INR</p>
            <p className="text-slate-500 font-semibold">Status: {appointment.paymentStatus}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Patient Name</span>
            <p className="font-bold text-slate-900">{appointment.patientName}</p>
            <p className="text-slate-500 font-mono text-[10px]">ID: {appointment.patientId}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1 sm:col-span-3">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Health Concern / Problem (Protected Privacy)</span>
            <p className="text-slate-700 leading-relaxed">{appointment.problem}</p>
          </div>

        </div>

        {/* TIMELINE PROGRESS BAR */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Consultation Lifecycle Progress
          </h4>

          <div className="space-y-3">
            {appointment.timeline.map((stage, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    stage.status === 'COMPLETED'
                      ? 'bg-emerald-600 text-white'
                      : stage.status === 'CURRENT'
                      ? 'bg-teal-600 text-white animate-pulse'
                      : stage.status === 'CANCELLED'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  ✓
                </div>
                <div className="flex-1 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800">{stage.label}</span>
                  {stage.timestamp && <span className="text-[10px] text-slate-400">{stage.timestamp}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </Card>

      {/* CANCELLATION MODAL */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        appointment={appointment}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />

    </div>
  )
}
