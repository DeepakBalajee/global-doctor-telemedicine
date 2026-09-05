'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Stethoscope,
  Award,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react'
import { DoctorDashboardData } from '@/types/doctor-dashboard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getDoctorDashboardData } from '@/lib/doctor/doctor-dashboard-client'

export const DoctorDashboardView: React.FC = () => {
  const [data, setData] = useState<DoctorDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      const res = await getDoctorDashboardData()
      if (res) {
        setData(res)
      }
      setIsLoading(false)
    }
    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading doctor workstation dashboard...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Doctor Access Required</h3>
        <p className="text-xs text-slate-500">Please sign in to access your doctor dashboard.</p>
        <Link href="/doctor/login">
          <Button variant="teal" size="md">Go to Doctor Sign In</Button>
        </Link>
      </Card>
    )
  }

  const { profile, statistics, upcomingAppointments } = data

  return (
    <div className="space-y-6">
      
      {/* WELCOME BANNER & CATEGORY SUMMARY */}
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-600/30">
              <Stethoscope className="h-8 w-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> VERIFIED DOCTOR
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Lic: {profile.licenseNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {profile.fullName}
              </h1>
              <p className="text-xs text-slate-300">
                Category: <strong>{profile.doctorType === 'SPECIALIST' ? `Specialist (${profile.specialtyName})` : 'General Physician'}</strong> • Experience: {profile.experienceYears} Years
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/doctor/profile">
              <Button variant="outline" size="md" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-semibold gap-2">
                <Award className="w-4 h-4 text-teal-400" /> View Profile
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 4 STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Appointments</span>
            <Clock className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{statistics.todayAppointmentsCount}</div>
          <p className="text-[11px] text-slate-400">Scheduled for today</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Appointments</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-700">{statistics.upcomingAppointmentsCount}</div>
          <p className="text-[11px] text-slate-400">Next 7 days</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{statistics.completedConsultationsCount}</div>
          <p className="text-[11px] text-slate-400">Total sessions fulfilled</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Patients</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{statistics.totalPatientsCount}</div>
          <p className="text-[11px] text-slate-400">Unique patient consultations</p>
        </Card>

      </div>

      {/* UPCOMING APPOINTMENTS SECTION */}
      <Card className="p-6 border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" /> Upcoming Patient Consultations
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Strict IDOR Ownership Protection
          </span>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((app) => (
              <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{app.patientName}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">({app.patientGender}, {app.patientAge} yrs)</span>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                      {app.appointmentStatus}
                    </span>
                  </div>
                  <p className="text-slate-600">Consultation Mode: <strong>{app.consultationType}</strong></p>
                  <p className="text-slate-500">Scheduled: <strong>{app.appointmentDate}</strong> at <strong>{app.preferredTime}</strong></p>
                  <p className="text-slate-400 italic pt-0.5">{app.problem}</p>
                </div>

                <div className="text-right text-xs font-semibold space-y-1">
                  <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
                    Fee: ₹{app.feeInINR}.00 ({app.paymentStatus})
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No upcoming appointments.
          </div>
        )}
      </Card>

      {/* SECURITY FOOTER */}
      <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-teal-600" /> Protected doctor workstation • Server-authoritative role isolation & IDOR data privacy.
      </div>

    </div>
  )
}
