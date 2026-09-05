'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Video, Search, ShieldCheck, Eye, Clock, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fetchSuperAdminConsultations } from '@/lib/super-admin/super-admin-client'

export const SuperAdminConsultationsPanel: React.FC = () => {
  const [consultations, setConsultations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const list = await fetchSuperAdminConsultations()
      setConsultations(list)
      setIsLoading(false)
    }
    load()
  }, [])

  const filtered = consultations.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
            <Video className="w-3.5 h-3.5 text-sky-600" /> Master Platform Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Consultation Sessions Management
          </h1>
          <p className="text-xs text-slate-500">
            Super Admin master oversight of video/audio consultation sessions and active session status.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="w-full sm:w-72">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient, doctor, or session ID..."
          className="text-xs py-2"
        />
      </div>

      {/* CONSULTATIONS TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Master Consultation Sessions Directory ({filtered.length})
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading master consultations...</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Session ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{c.id}</td>
                    <td className="p-3 font-semibold">{c.patientName}</td>
                    <td className="p-3 text-slate-700">{c.doctorName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {c.consultationType}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900' : 'bg-sky-100 text-sky-900 animate-pulse'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{c.durationMinutes || 15} mins</td>
                    <td className="p-3 text-right">
                      <Link href={`/super-admin/consultations/${c.id}`}>
                        <Button variant="outline" size="sm" className="font-bold text-[11px] gap-1">
                          <Eye className="w-3 h-3 text-sky-600" /> Inspect Session
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  )
}
