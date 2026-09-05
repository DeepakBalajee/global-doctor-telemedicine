'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle2, Search, Stethoscope, Filter } from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DoctorAppointmentCard } from './DoctorAppointmentCard'
import { DoctorActionModal } from './DoctorActionModal'
import {
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} from '@/lib/doctor/doctor-appointment-client'

export const DoctorAppointmentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past' | 'cancelled'>('today')
  const [appointments, setAppointments] = useState<PatientAppointmentDetail[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Action Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointmentDetail | null>(null)
  const [modalAction, setModalAction] = useState<'complete' | 'cancel' | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadAppointments = async (tab: 'today' | 'upcoming' | 'past' | 'cancelled') => {
    setIsLoading(true)
    const res = await getDoctorAppointments(tab)
    setAppointments(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAppointments(activeTab)
  }, [activeTab])

  const handleOpenActionModal = (app: PatientAppointmentDetail, action: 'complete' | 'cancel') => {
    setSelectedAppointment(app)
    setModalAction(action)
    setIsModalOpen(true)
  }

  const handleConfirmAction = async (action: 'complete' | 'cancel', reason?: string) => {
    if (!selectedAppointment) return
    setMessage(null)

    const res = await updateDoctorAppointmentStatus(selectedAppointment.id, action, reason)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Status updated successfully.' })
      loadAppointments(activeTab)
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update status.' })
    }
  }

  const filteredAppointments = appointments.filter((app) =>
    searchQuery
      ? app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Doctor Appointment Workstation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Manage Patient Consultations
          </h1>
          <p className="text-xs text-slate-500">
            View today&apos;s schedule, confirm upcoming sessions, and complete patient consultations with server authorization.
          </p>
        </div>

        <Input
          placeholder="Search by patient name or Ref ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
          className="w-full sm:w-64 text-xs"
        />
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
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'today'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Today&apos;s Sessions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'upcoming'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming (Next 7 Days)
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
          Completed Consultations
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
          <p className="text-xs font-semibold text-slate-500">Loading doctor appointments...</p>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-3">
          {filteredAppointments.map((app) => (
            <DoctorAppointmentCard
              key={app.id}
              appointment={app}
              onCompleteClick={(a) => handleOpenActionModal(a, 'complete')}
              onCancelClick={(a) => handleOpenActionModal(a, 'cancel')}
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
            {activeTab === 'today'
              ? 'No patient consultations scheduled for today.'
              : `No ${activeTab} appointment records.`}
          </p>
        </Card>
      )}

      {/* ACTION MODAL */}
      <DoctorActionModal
        isOpen={isModalOpen}
        appointment={selectedAppointment}
        action={modalAction}
        onClose={() => setIsModalOpen(false)}
        onConfirmAction={handleConfirmAction}
      />

    </div>
  )
}
