'use client'

import React, { useState, useEffect } from 'react'
import { Activity, Users, Stethoscope, Calendar, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { fetchAdminAnalytics } from '@/lib/analytics/analytics-client'

export const AdminAnalyticsView: React.FC = () => {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchAdminAnalytics()
      setData(res)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
          <Activity className="w-3.5 h-3.5 text-brand-600" /> Operational Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Admin Operational Performance Insights
        </h1>
        <p className="text-xs text-slate-500">
          Permitted operational statistics for patient registration, doctor verification, and appointment completion rates.
        </p>
      </div>

      {isLoading || !data ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading operational analytics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Patients</span>
            <div className="text-2xl font-black text-slate-900">{data.totalPatients}</div>
            <p className="text-[11px] text-slate-500">Registered Accounts</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Doctors</span>
            <div className="text-2xl font-black text-slate-900">{data.totalDoctors}</div>
            <p className="text-[11px] text-amber-600 font-semibold">{data.pendingDoctorsCount} Pending Verification</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Appointments</span>
            <div className="text-2xl font-black text-slate-900">{data.totalAppointments}</div>
            <p className="text-[11px] text-slate-500">{data.completedAppointments} Completed</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Completion Rate</span>
            <div className="text-2xl font-black text-emerald-600">{data.completionRatePercentage}%</div>
            <p className="text-[11px] text-slate-500">Operational Metric</p>
          </Card>
        </div>
      )}

    </div>
  )
}
