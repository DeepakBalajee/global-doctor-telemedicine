'use client'

import React from 'react'
import Link from 'next/link'
import { Video, ShieldCheck, ArrowLeft, Clock, User, Stethoscope, CheckCircle2, Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export interface SuperAdminConsultationDetailViewProps {
  consultation: any
}

export const SuperAdminConsultationDetailView: React.FC<SuperAdminConsultationDetailViewProps> = ({
  consultation,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* ACTIONS BAR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link href="/super-admin/consultations" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Consultations Directory
        </Link>
        <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Super Admin Master Operational View
        </span>
      </div>

      {/* CONSULTATION CARD */}
      <Card className="p-8 border-slate-200 bg-white rounded-2xl space-y-6 shadow-xl">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
              <Video className="w-3.5 h-3.5 text-sky-600" /> Operational Session Record
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              Consultation Session #{consultation.id}
            </h1>
            <p className="text-xs text-slate-500 font-mono">Appointment ID: #{consultation.appointmentId}</p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            consultation.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900'
          }`}>
            {consultation.status}
          </span>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Patient Participant</span>
            <p className="font-extrabold text-slate-900 text-sm">{consultation.patientName}</p>
            <p className="text-slate-500 font-mono">ID: {consultation.patientId}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Doctor Participant</span>
            <p className="font-extrabold text-slate-900 text-sm">{consultation.doctorName}</p>
            <p className="text-teal-700 font-semibold">{consultation.specialtyName || 'Cardiology'}</p>
          </div>
        </div>

        {/* SESSION TIMING & DURATION */}
        <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2 text-xs">
          <h3 className="font-extrabold text-slate-900">Session Operational Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Type</span>
              <span className="font-bold text-slate-800">{consultation.consultationType}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Duration</span>
              <span className="font-bold text-slate-800">{consultation.durationMinutes || 15} minutes</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block">Session Created</span>
              <span className="font-bold text-slate-800">{new Date(consultation.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SECRET ISOLATION SAFEGUARD NOTICE */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-2 font-extrabold">
            <Lock className="w-4 h-4 text-amber-700" /> Security Safeguard: Real-Time Stream Isolation
          </div>
          <p className="text-[11px] text-amber-800">
            WebRTC encryption keys, TURN credential tokens, and private audio/video buffers remain strictly isolated in client memory and are never stored or exposed to platform administrators.
          </p>
        </div>

      </Card>
    </div>
  )
}
