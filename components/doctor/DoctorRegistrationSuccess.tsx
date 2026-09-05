'use client'

import React from 'react'
import Link from 'next/link'
import { ShieldAlert, CheckCircle, ArrowRight, UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface DoctorRegistrationSuccessProps {
  doctorId?: string
}

export const DoctorRegistrationSuccess: React.FC<DoctorRegistrationSuccessProps> = ({
  doctorId = 'DOC-PREVIEW-101',
}) => {
  return (
    <Card className="p-8 sm:p-10 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-2xl mx-auto text-center space-y-6">
      
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
        <ShieldAlert className="h-9 w-9 stroke-[2]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
          Status: PENDING_VERIFICATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-2">
          Registration Submitted
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your doctor registration profile has been submitted and is currently pending administrative credential review.
        </p>
        <p className="text-xs text-slate-400 font-mono pt-1">
          Registration Reference ID: <span className="font-bold text-slate-800">{doctorId}</span>
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-left space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-brand-600" /> Next Verification Steps:
        </h4>
        <ul className="space-y-2 text-slate-600 pl-6 list-disc leading-relaxed">
          <li>Platform Head Members will review your medical qualification certificates and license numbers.</li>
          <li>Upon successful verification, your account status will transition to <strong>VERIFIED</strong>.</li>
          <li>You will receive an activation notification via email and SMS before your doctor profile becomes publicly bookable.</li>
        </ul>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/login?role=doctor" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full sm:w-auto font-semibold gap-2">
            <UserCheck className="w-4 h-4" /> Go to Doctor Sign In
          </Button>
        </Link>

        <Link href="/" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold gap-2">
            Return to Homepage <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

    </Card>
  )
}
