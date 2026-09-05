'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, ShieldCheck, ArrowLeft, User, Stethoscope, CreditCard, Video, FileText, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface SuperAdminAppointmentDetailViewProps {
  appointment: any
}

export const SuperAdminAppointmentDetailView: React.FC<SuperAdminAppointmentDetailViewProps> = ({
  appointment,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* ACTIONS BAR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link href="/super-admin/appointments" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Master Appointments
        </Link>
        <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Super Admin Master Operational View
        </span>
      </div>

      {/* APPOINTMENT CARD */}
      <Card className="p-8 border-slate-200 bg-white rounded-2xl space-y-6 shadow-xl">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
              <Calendar className="w-3.5 h-3.5 text-brand-600" /> Master Appointment Inspection
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              Appointment #{appointment.id}
            </h1>
            <p className="text-xs text-slate-500 font-mono">Date: {appointment.appointmentDate} • Time: {appointment.timeSlot}</p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900">
            {appointment.appointmentStatus}
          </span>
        </div>

        {/* PARTICIPANTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Patient</span>
            <p className="font-extrabold text-slate-900 text-sm">{appointment.patientName}</p>
            <p className="text-slate-500 font-mono">ID: {appointment.patientId}</p>
            <p className="text-slate-600">{appointment.patientMobile}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Assigned Doctor</span>
            <p className="font-extrabold text-slate-900 text-sm">{appointment.doctorName}</p>
            <p className="text-teal-700 font-semibold">{appointment.specialtyName}</p>
            <p className="text-slate-500 font-mono">ID: {appointment.doctorId}</p>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Consultation Payment Fee</span>
            <span className="font-black text-emerald-800 text-base">₹5.00 INR</span>
            <p className="text-[11px] text-slate-500 font-mono">Txn Ref: TXN-PAY-88190-SUCCESS</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
            Payment Verified
          </span>
        </div>

        {/* DEEP LINKS */}
        <div className="flex items-center gap-3 pt-2">
          <Link href={`/super-admin/consultations/SES-${appointment.id}`}>
            <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
              <Video className="w-3.5 h-3.5 text-sky-600" /> View Session
            </Button>
          </Link>

          <Link href={`/patient/prescriptions/PRX-1001`}>
            <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" /> View Digital Rx
            </Button>
          </Link>
        </div>

      </Card>
    </div>
  )
}
