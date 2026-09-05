'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Calendar, Video, FileText, DollarSign, CheckCircle2 } from 'lucide-react'
import { DoctorPersonalAnalytics } from '@/types/analytics'
import { Card } from '@/components/ui/Card'
import { fetchDoctorAnalytics } from '@/lib/analytics/analytics-client'

export const DoctorAnalyticsView: React.FC = () => {
  const [data, setData] = useState<DoctorPersonalAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchDoctorAnalytics()
      setData(res)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
          <TrendingUp className="w-3.5 h-3.5 text-teal-600" /> Doctor Practice Insights
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Clinical Practice & Patient Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Personal practice performance, completed consultations, unique patients served, and earnings.
        </p>
      </div>

      {isLoading || !data ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading practice analytics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Appointments</span>
            <div className="text-2xl font-black text-slate-900">{data.totalAppointments}</div>
            <p className="text-[11px] text-slate-500">{data.completedConsultations} Completed</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Patients Served</span>
            <div className="text-2xl font-black text-teal-700">{data.uniquePatientsServed}</div>
            <p className="text-[11px] text-slate-500">Unique Patients Consulted</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Prescriptions Issued</span>
            <div className="text-2xl font-black text-slate-900">{data.prescriptionsIssued}</div>
            <p className="text-[11px] text-slate-500">Digital Prescriptions</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Net Earnings</span>
            <div className="text-2xl font-black text-emerald-700">₹{data.totalEarningsInINR.toFixed(2)}</div>
            <p className="text-[11px] text-slate-500">Available: ₹{data.availableBalanceInINR.toFixed(2)}</p>
          </Card>
        </div>
      )}

    </div>
  )
}
