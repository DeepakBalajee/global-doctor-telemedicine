'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react'
import { ConsultationSession } from '@/types/consultation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface ConsultationEndedViewProps {
  session: ConsultationSession
  returnUrl: string
}

export const ConsultationEndedView: React.FC<ConsultationEndedViewProps> = ({
  session,
  returnUrl,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="p-8 max-w-lg w-full bg-white border-slate-200 rounded-2xl shadow-xl text-center space-y-6">
        
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-md mx-auto">
          <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Session Concluded
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
            Consultation Session Completed
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your telemedicine consultation with {session.doctorName} for {session.patientName} has been successfully completed.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
          <div className="flex justify-between items-center text-slate-600">
            <span className="font-semibold">Doctor:</span>
            <span className="font-bold text-slate-900">{session.doctorName}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span className="font-semibold">Specialty:</span>
            <span className="text-slate-800">{session.specialtyName || 'General Medicine'}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span className="font-semibold">Consultation Duration:</span>
            <span className="font-mono font-bold text-teal-700">{session.durationMinutes || 15} mins</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span className="font-semibold">Status:</span>
            <span className="font-bold text-emerald-700">COMPLETED</span>
          </div>
        </div>

        <div className="pt-2">
          <Link href={returnUrl}>
            <Button variant="teal" size="md" className="w-full font-bold text-xs gap-2">
              Return to Workstation <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </Card>
    </div>
  )
}
