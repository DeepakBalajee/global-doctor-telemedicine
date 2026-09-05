'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Stethoscope,
  Users,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Crown,
} from 'lucide-react'
import { AdminDashboardData } from '@/types/admin'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getAdminDashboardData } from '@/lib/admin/admin-client'

export interface AdminDashboardViewProps {
  isSuperAdmin?: boolean
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  isSuperAdmin = false,
}) => {
  const [stats, setStats] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true)
      const res = await getAdminDashboardData()
      if (res) {
        setStats(res)
      }
      setIsLoading(false)
    }
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading admin console analytics...</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      
      {/* WELCOME BANNER */}
      <Card
        className={`p-6 sm:p-8 rounded-2xl border text-white shadow-xl ${
          isSuperAdmin
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border-slate-800'
            : 'bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-xl ${
                isSuperAdmin ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-teal-600 text-white font-bold'
              }`}
            >
              {isSuperAdmin ? <Crown className="w-8 h-8 stroke-[2]" /> : <ShieldCheck className="w-8 h-8 stroke-[2]" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border inline-flex items-center gap-1 ${
                    isSuperAdmin
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  }`}
                >
                  {isSuperAdmin ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />}
                  {isSuperAdmin ? 'SUPER ADMIN CONSOLE' : 'PLATFORM ADMINISTRATION'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Telemedicine Platform Overview
              </h1>
              <p className="text-xs text-slate-300">
                Server-authoritative role boundaries, doctor verification queue, patient account management, and payment receipts.
              </p>
            </div>
          </div>

          {isSuperAdmin && (
            <Link href="/super-admin/admins">
              <Button variant="primary" size="md" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs gap-2">
                <Crown className="w-4 h-4" /> Manage Admins & Audit Logs
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* 8 STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Doctors</span>
            <Stethoscope className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalDoctors}</div>
          <p className="text-[11px] text-slate-400">Registered practitioners</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Doctor Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{stats.pendingDoctors}</div>
          <p className="text-[11px] text-slate-400">Awaiting credential review</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Verified Doctors</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats.activeDoctors}</div>
          <p className="text-[11px] text-slate-400">Eligible to take appointments</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Patients</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalPatients}</div>
          <p className="text-[11px] text-slate-400">Registered patient accounts</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Appointments</span>
            <Clock className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.todayAppointments}</div>
          <p className="text-[11px] text-slate-400">Scheduled for today</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Consultations</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.upcomingAppointments}</div>
          <p className="text-[11px] text-slate-400">Confirmed future sessions</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.completedAppointments}</div>
          <p className="text-[11px] text-slate-400">Fulfilled sessions</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Cancelled Appointments</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.cancelledAppointments}</div>
          <p className="text-[11px] text-slate-400">Total cancelled sessions</p>
        </Card>

      </div>

      {/* QUICK SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" /> Doctor Verification Queue
          </h3>
          <p className="text-xs text-slate-500">Review pending doctor registration applications, verify credentials, and approve or suspend accounts.</p>
          <Link href="/admin/doctors" className="inline-block pt-1">
            <Button variant="teal" size="sm" className="font-semibold text-xs gap-1.5">
              Review Doctors <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" /> Patient Account Administration
          </h3>
          <p className="text-xs text-slate-500">Manage registered patient accounts, view operational account status, and enforce account suspension if needed.</p>
          <Link href="/admin/patients" className="inline-block pt-1">
            <Button variant="outline" size="sm" className="font-semibold text-xs gap-1.5">
              Manage Patients <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Transactions (₹5)
          </h3>
          <p className="text-xs text-slate-500">View server-verified Razorpay consultation payment receipts and transaction references.</p>
          <Link href="/admin/payments" className="inline-block pt-1">
            <Button variant="outline" size="sm" className="font-semibold text-xs gap-1.5">
              View Payments <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </Card>
      </div>

    </div>
  )
}
