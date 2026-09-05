'use client'

import React, { useState, useEffect } from 'react'
import { Activity, Calendar, Video, FileText, FileSpreadsheet, CreditCard } from 'lucide-react'
import { PatientPersonalActivity } from '@/types/analytics'
import { Card } from '@/components/ui/Card'
import { fetchPatientActivity } from '@/lib/analytics/analytics-client'

export const PatientActivityView: React.FC = () => {
  const [data, setData] = useState<PatientPersonalActivity | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchPatientActivity()
      setData(res)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
          <Activity className="w-3.5 h-3.5 text-teal-600" /> Patient Activity & Health Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          My Account Activity & Health Summary
        </h1>
        <p className="text-xs text-slate-500">
          Personal consultation activity, prescriptions, medical document uploads, and payment history.
        </p>
      </div>

      {isLoading || !data ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading personal activity...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Appointments</span>
            <div className="text-2xl font-black text-slate-900">{data.totalAppointments}</div>
            <p className="text-[11px] text-slate-500">{data.completedConsultations} Completed</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Digital Prescriptions</span>
            <div className="text-2xl font-black text-teal-700">{data.prescriptionsCount}</div>
            <p className="text-[11px] text-slate-500">Issued by Doctor</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Lab Documents</span>
            <div className="text-2xl font-black text-slate-900">{data.documentsCount}</div>
            <p className="text-[11px] text-slate-500">Uploaded Reports</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Paid</span>
            <div className="text-2xl font-black text-emerald-700">₹{(Number(data?.totalPaymentsInINR) || 0).toFixed(2)}</div>
            <p className="text-[11px] text-slate-500">Verified Payments</p>
          </Card>
        </div>
      )}

    </div>
  )
}
