'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Video,
  PhoneCall,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Play,
} from 'lucide-react'
import { ConsultationSession } from '@/types/consultation'
import { UserRole } from '@/types/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  getConsultationSession,
  startConsultation,
  endConsultation,
} from '@/lib/consultations/consultation-client'
import { MediaCallStage } from './MediaCallStage'
import { ConsultationChatPanel } from './ConsultationChatPanel'
import { EndConsultationDialog } from './EndConsultationDialog'
import { ConsultationEndedView } from './ConsultationEndedView'

export interface ConsultationRoomViewProps {
  appointmentId: string
  activeUserId: string
  activeUserRole: UserRole
  returnUrl: string
}

export const ConsultationRoomView: React.FC<ConsultationRoomViewProps> = ({
  appointmentId,
  activeUserId,
  activeUserRole,
  returnUrl,
}) => {
  const [session, setSession] = useState<ConsultationSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEndModalOpen, setIsEndModalOpen] = useState(false)

  const loadSession = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const res = await getConsultationSession(appointmentId)

    if (res.success && res.session) {
      setSession(res.session)
    } else {
      setError(res.error || 'Access Denied. You are not authorized to access this consultation.')
    }
    setIsLoading(false)
  }, [appointmentId])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const handleStartSession = async () => {
    if (!session) return
    const res = await startConsultation(appointmentId)
    if (res.success && res.session) {
      setSession(res.session)
    }
  }

  const handleConfirmEndCall = async () => {
    if (!session) return
    const res = await endConsultation(appointmentId)
    if (res.success && res.session) {
      setSession(res.session)
    }
    setIsEndModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Verifying consultation session authorization...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full bg-white border-red-200 rounded-2xl shadow-xl text-center space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mx-auto">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">Consultation Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link href={returnUrl}>
              <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (session.status === 'COMPLETED') {
    return <ConsultationEndedView session={session} returnUrl={returnUrl} />
  }

  const isDoctor = activeUserRole === UserRole.DOCTOR
  const participantName = isDoctor ? session.patientName : session.doctorName
  const participantRoleLabel = isDoctor ? 'PATIENT' : `DOCTOR (${session.specialtyName || 'Specialist'})`

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* ROOM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={returnUrl} className="text-slate-400 hover:text-slate-700">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
              Session #{session.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            {isDoctor ? `Consultation with ${session.patientName}` : `Consultation with ${session.doctorName}`}
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span>Specialty: {session.specialtyName || 'General Medicine'}</span>
            <span>•</span>
            <span className="font-mono">Type: {session.consultationType}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              session.status === 'ACTIVE'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            ● {session.status}
          </span>

          {session.status === 'READY' && isDoctor && (
            <Button
              type="button"
              variant="teal"
              size="sm"
              onClick={handleStartSession}
              className="font-bold text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
            >
              <Play className="w-3.5 h-3.5" /> Start Consultation Session
            </Button>
          )}
        </div>
      </div>

      {/* MAIN CONSULTATION GRID: CALL STAGE & CHAT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MEDIA CALL STAGE (7 COLS ON DESKTOP) */}
        <div className="lg:col-span-7">
          <MediaCallStage
            participantName={participantName}
            participantRoleLabel={participantRoleLabel}
            consultationType={session.consultationType}
            onEndCallClick={() => setIsEndModalOpen(true)}
          />
        </div>

        {/* IN-SESSION CHAT PANEL (5 COLS ON DESKTOP) */}
        <div className="lg:col-span-5">
          <ConsultationChatPanel
            appointmentId={appointmentId}
            activeUserId={activeUserId}
            activeUserRole={activeUserRole}
          />
        </div>

      </div>

      {/* END CONSULTATION MODAL */}
      <EndConsultationDialog
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirmEnd={handleConfirmEndCall}
      />

    </div>
  )
}
