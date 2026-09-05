'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Stethoscope,
  Award,
  CheckCircle,
  LogOut,
  Calendar,
  Video,
  FileText,
  Clock,
  ShieldCheck,
  User,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { logoutDoctor } from '@/lib/doctor/doctor-auth-client'

export interface DoctorDashboardPlaceholderProps {
  doctorName?: string
  doctorType?: string
  specialtyName?: string
  licenseNumber?: string
}

export const DoctorDashboardPlaceholder: React.FC<DoctorDashboardPlaceholderProps> = ({
  doctorName = 'Dr. Sarah Jenkins',
  doctorType = 'SPECIALIST',
  specialtyName = 'Cardiology',
  licenseNumber = 'MCI-889012',
}) => {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutDoctor()
    router.push('/doctor/login')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* VERIFIED DOCTOR HEADER BAR */}
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 text-white rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-600/30">
              <Stethoscope className="h-8 w-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 inline-flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> VERIFIED DOCTOR
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Lic: {licenseNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {doctorName}
              </h1>
              <p className="text-xs text-slate-300">
                {doctorType === 'SPECIALIST' ? `Specialist — ${specialtyName}` : 'General Physician'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-semibold gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* DASHBOARD WORKSPACE PLACEHOLDER CARD */}
      <Card className="p-8 border-slate-200 shadow-card bg-white rounded-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <Award className="h-6 w-6 stroke-[2]" />
          </div>
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Doctor Workspace Dashboard — Protected Route
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Authentication & server-side authorization verified. Role-based access control allows access exclusively to verified doctor accounts.
          </p>
        </div>

        {/* FEATURE MODULE PREVIEWS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <Calendar className="w-5 h-5 text-brand-600" />
            <h4 className="text-xs font-bold text-slate-900">Appointment Management</h4>
            <p className="text-[11px] text-slate-500">Configure availability slots & manage upcoming consultations.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <Video className="w-5 h-5 text-teal-600" />
            <h4 className="text-xs font-bold text-slate-900">HD Consultation Room</h4>
            <p className="text-[11px] text-slate-500">Browser-based WebRTC video/audio calls & chat support.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <FileText className="w-5 h-5 text-brand-600" />
            <h4 className="text-xs font-bold text-slate-900">Digital Rx & Records</h4>
            <p className="text-[11px] text-slate-500">Issue verified digital prescriptions & view clinical notes.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" /> Role: DOCTOR (Verified)
          </span>
          <Link href="/" className="font-semibold text-brand-600 hover:underline">
            Return to Homepage →
          </Link>
        </div>
      </Card>

    </div>
  )
}
