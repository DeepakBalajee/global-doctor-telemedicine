'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Video,
  FileText,
  FileSpreadsheet,
  CreditCard,
  Bell,
  Lock,
  Activity,
  HeartPulse,
  Settings,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { SuperAdminMasterMetrics } from '@/types/super-admin'
import { Card } from '@/components/ui/Card'
import { fetchSuperAdminMetrics } from '@/lib/super-admin/super-admin-client'
import { SuperAdminGlobalSearch } from './SuperAdminGlobalSearch'

export const SuperAdminMasterDashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<SuperAdminMasterMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchSuperAdminMetrics()
      setMetrics(res)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER & GLOBAL SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Master Platform Operations & Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Super Admin Control Hub
          </h1>
          <p className="text-xs text-slate-500">
            Single Master Platform Authority • Central Management of 14 Telemedicine Modules
          </p>
        </div>

        <SuperAdminGlobalSearch />
      </div>

      {/* 14 MODULE METRICS GRID */}
      <div className="space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Master Module Overview (14 Modules)
        </h2>

        {isLoading || !metrics ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading master analytics...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. PATIENTS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">1. Patients</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalPatients}</div>
              <p className="text-[11px] text-slate-500">
                <span className="text-emerald-600 font-bold">{metrics.activePatients} Active</span> •{' '}
                <span className="text-red-600 font-bold">{metrics.suspendedPatients} Suspended</span>
              </p>
              <Link href="/super-admin/patients" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Patients <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 2. DOCTORS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">2. Doctors</span>
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalDoctors}</div>
              <p className="text-[11px] text-slate-500">
                <span className="text-emerald-600 font-bold">{metrics.verifiedDoctors} Verified</span> •{' '}
                <span className="text-amber-600 font-bold">{metrics.pendingDoctors} Pending</span>
              </p>
              <Link href="/super-admin/doctors" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Doctors <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 3. ADMINS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">3. Admin Accounts</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalAdmins}</div>
              <p className="text-[11px] text-slate-500">
                <span className="text-emerald-600 font-bold">{metrics.activeAdmins} Active</span> • 1 Master Super Admin
              </p>
              <Link href="/super-admin/admins" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Admins <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 4. APPOINTMENTS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">4. Appointments</span>
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalAppointments}</div>
              <p className="text-[11px] text-slate-500">
                <span className="text-emerald-600 font-bold">{metrics.completedAppointments} Completed</span> •{' '}
                <span className="text-red-600 font-bold">{metrics.cancelledAppointments} Cancelled</span>
              </p>
              <Link href="/super-admin/appointments" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Appointments <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 5. CONSULTATIONS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">5. Consultations</span>
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Video className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalConsultations}</div>
              <p className="text-[11px] text-slate-500">
                <span className="text-sky-600 font-bold">{metrics.activeConsultations} Active Session</span>
              </p>
              <Link href="/super-admin/consultations" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Sessions <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 6. PRESCRIPTIONS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">6. Digital Prescriptions</span>
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalPrescriptions}</div>
              <p className="text-[11px] text-slate-500">
                <span className="text-emerald-600 font-bold">{metrics.activePrescriptions} Issued</span> •{' '}
                <span className="text-red-600 font-bold">{metrics.revokedPrescriptions} Revoked</span>
              </p>
              <Link href="/super-admin/prescriptions" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Prescriptions <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 7. MEDICAL DOCUMENTS */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">7. Medical Documents</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{metrics.totalMedicalDocuments}</div>
              <p className="text-[11px] text-slate-500">Lab Diagnostic Reports & Scans</p>
              <Link href="/super-admin/medical-documents" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Documents <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

            {/* 8. PAYMENTS & REVENUE */}
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-2 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">8. Payments & Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-700">₹{(Number(metrics?.totalRevenueInINR) || 0).toFixed(2)}</div>
              <p className="text-[11px] text-slate-500">
                Fee: <strong className="text-slate-900">₹5.00 INR</strong> • {metrics.successfulPayments} Transactions
              </p>
              <Link href="/super-admin/payments" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800 pt-1">
                Manage Payments <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>

          </div>
        )}
      </div>

    </div>
  )
}
