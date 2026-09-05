'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, ShieldAlert, ArrowRight, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { logoutDoctor } from '@/lib/doctor/doctor-auth-client'

export interface DoctorPendingVerificationCardProps {
  doctorName?: string
  registrationId?: string
}

export const DoctorPendingVerificationCard: React.FC<DoctorPendingVerificationCardProps> = ({
  doctorName = 'Doctor Account',
  registrationId = 'REG-DOC-88910',
}) => {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutDoctor()
    router.push('/doctor/login')
  }

  return (
    <Card className="p-8 sm:p-10 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-xl mx-auto text-center space-y-6">
      
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
        <Clock className="h-9 w-9 stroke-[2] animate-pulse" />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
          Account Status: PENDING_VERIFICATION
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
          Your Account is Awaiting Verification
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Hello <strong>{doctorName}</strong>. Your account has been registered successfully, but access to full doctor consultation services will be available after administrative verification.
        </p>
        <p className="text-xs text-slate-400 font-mono pt-1">
          Reference ID: <span className="font-bold text-slate-800">{registrationId}</span>
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" /> Platform Verification Policy
        </div>
        <p className="leading-relaxed">
          Medical council credentials, degree certificates, and licensing numbers undergo manual administrative review to ensure patient safety and compliance.
        </p>
        <p className="text-slate-500 leading-relaxed">
          An email notification will be dispatched as soon as your account status transitions to <strong>VERIFIED</strong>.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          className="w-full sm:w-auto font-semibold gap-2"
        >
          <LogOut className="w-4 h-4 text-slate-600" /> Sign Out
        </Button>

        <Link href="/" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full sm:w-auto font-semibold gap-2">
            Return to Homepage <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

    </Card>
  )
}
