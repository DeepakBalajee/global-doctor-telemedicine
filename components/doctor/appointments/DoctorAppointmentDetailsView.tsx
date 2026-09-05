'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Video,
  VideoOff,
  Stethoscope,
} from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DoctorActionModal } from './DoctorActionModal'
import {
  getDoctorAppointmentDetail,
  updateDoctorAppointmentStatus,
} from '@/lib/doctor/doctor-appointment-client'

export interface DoctorAppointmentDetailsViewProps {
  appointmentId: string
}

export const DoctorAppointmentDetailsView: React.FC<DoctorAppointmentDetailsViewProps> = ({
  appointmentId,
}) => {
  const [appointment, setAppointment] = useState<PatientAppointmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Action Modal State
  const [modalAction, setModalAction] = useState<'complete' | 'cancel' | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true)
      const res = await getDoctorAppointmentDetail(appointmentId)
      if (res) {
        setAppointment(res)
      }
      setIsLoading(false)
    }
    loadDetail()
  }, [appointmentId])

  const handleOpenActionModal = (action: 'complete' | 'cancel') => {
    setModalAction(action)
    setIsModalOpen(true)
  }

  const handleConfirmAction = async (action: 'complete' | 'cancel', reason?: string) => {
    setMessage(null)
    const res = await updateDoctorAppointmentStatus(appointmentId, action, reason)
    if (res.success && res.appointment) {
      setAppointment(res.appointment)
      setMessage({ type: 'success', text: res.message || 'Status updated successfully.' })
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update status.' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading doctor appointment details...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Appointment Not Found</h3>
        <p className="text-xs text-slate-500">The requested appointment could not be retrieved or is not assigned to your doctor account.</p>
        <Link href="/doctor/appointments">
          <Button variant="teal" size="sm">Back to Appointments</Button>
        </Link>
      </Card>
    )
  }

  const isUpcoming = appointment.appointmentStatus === 'CONFIRMED' || appointment.appointmentStatus === 'REQUESTED'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* BACK LINK */}
      <Link href="/doctor/appointments" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700">
        <ArrowLeft className="w-4 h-4" /> Back to Doctor Appointments
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
              Patient Consultation Overview
            </h1>
          </div>

          {isUpcoming && (
            <div className="flex items-center gap-2">
              <Button
                variant="teal"
                size="md"
                onClick={() => handleOpenActionModal('complete')}
                className="text-xs font-bold"
              >
                Mark Complete
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleOpenActionModal('cancel')}
                className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200"
              >
                Cancel Session
              </Button>
            </div>
          )}
        </div>

        {/* PATIENT SUMMARY CARD */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
              <User className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-extrabold text-slate-900">{appointment.patientName}</h3>
              <p className="text-xs text-slate-500 font-mono">Patient ID: {appointment.patientId}</p>
            </div>
          </div>

          {/* FUTURE CONSULTATION ROOM BUTTON */}
          <div className="space-y-1 text-right">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs font-semibold gap-1.5 opacity-70 cursor-not-allowed bg-slate-100 text-slate-500"
            >
              <Video className="w-4 h-4 text-slate-400" /> Video Room (Coming Soon)
            </Button>
          </div>
        </div>

        {/* APPOINTMENT PARAMETERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Date & Time</span>
            <p className="font-bold text-slate-900">{appointment.appointmentDate}</p>
            <p className="text-slate-500 font-semibold">{appointment.startTime} – {appointment.endTime}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Consultation Mode</span>
            <p className="font-bold text-slate-900">{appointment.consultationType}</p>
            <p className="text-emerald-700 font-semibold">Fee: ₹{appointment.feeInINR}.00 ({appointment.paymentStatus})</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Assigned Doctor</span>
            <p className="font-bold text-slate-900">{appointment.doctorName}</p>
            <p className="text-slate-500">{appointment.specialtyName || 'General Medicine'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1 sm:col-span-3">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Patient Concern / Health Problem (Protected Privacy)</span>
            <p className="text-slate-800 leading-relaxed font-medium">{appointment.problem}</p>
          </div>

        </div>

        {/* TIMELINE */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Lifecycle Progress & Audit Trail
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

      {/* ACTION MODAL */}
      <DoctorActionModal
        isOpen={isModalOpen}
        appointment={appointment}
        action={modalAction}
        onClose={() => setIsModalOpen(false)}
        onConfirmAction={handleConfirmAction}
      />

    </div>
  )
}
