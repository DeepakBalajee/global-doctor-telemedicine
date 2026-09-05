'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AppointmentCard } from './AppointmentCard'
import { CancelAppointmentModal } from './CancelAppointmentModal'
import {
  getPatientAppointments,
  cancelPatientAppointment,
} from '@/lib/patient/patient-appointment-client'

export const PatientAppointmentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming')
  const [appointments, setAppointments] = useState<PatientAppointmentDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cancellation modal state
  const [selectedForCancel, setSelectedForCancel] = useState<PatientAppointmentDetail | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadAppointments = async (tab: 'upcoming' | 'past' | 'cancelled') => {
    setIsLoading(true)
    const res = await getPatientAppointments(tab)
    setAppointments(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAppointments(activeTab)
  }, [activeTab])

  const handleOpenCancelModal = (app: PatientAppointmentDetail) => {
    setSelectedForCancel(app)
    setIsCancelModalOpen(true)
  }

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedForCancel) return
    setMessage(null)

    const res = await cancelPatientAppointment(selectedForCancel.id, reason)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Appointment cancelled successfully.' })
      loadAppointments(activeTab)
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to cancel appointment.' })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <Calendar className="w-3.5 h-3.5 text-teal-600" /> Patient Appointment Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            My Consultations & Appointment History
          </h1>
          <p className="text-xs text-slate-500">
            Track confirmed telemedicine sessions, view past completed history, or cancel eligible appointments.
          </p>
        </div>

        <Link href="/patient/doctors">
          <Button variant="teal" size="md" className="font-bold text-xs">
            + Book New Consultation (₹5)
          </Button>
        </Link>
      </div>

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

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'upcoming'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming Sessions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'past'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Past History
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'cancelled'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* APPOINTMENTS LIST */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-slate-500">Loading appointments...</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((app) => (
            <AppointmentCard
              key={app.id}
              appointment={app}
              onCancelClick={handleOpenCancelModal}
            />
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center space-y-3 max-w-md mx-auto">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">
            No {activeTab} appointments found
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming consultations scheduled."
              : `No ${activeTab} consultation history.`}
          </p>
          {activeTab === 'upcoming' && (
            <Link href="/patient/doctors">
              <Button variant="teal" size="sm" className="font-bold text-xs mt-2">
                Find Doctor & Book (₹5)
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* CANCELLATION MODAL */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        appointment={selectedForCancel}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />

    </div>
  )
}
