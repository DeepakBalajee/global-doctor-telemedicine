'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Shield, Users, Stethoscope, Calendar, DollarSign, ExternalLink } from 'lucide-react'
import { GlobalSearchResult } from '@/types/search'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { fetchGlobalSearchResults } from '@/lib/search/search-client'

export const SuperAdminGlobalSearchOverlay: React.FC = () => {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<GlobalSearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function execute() {
      if (!query.trim()) {
        setData(null)
        return
      }
      setIsLoading(true)
      const res = await fetchGlobalSearchResults(query)
      setData(res)
      setIsLoading(false)
    }

    const timer = setTimeout(execute, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-900">
          <Shield className="w-3.5 h-3.5 text-purple-600" /> Master Platform Search
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Super Admin Global Command Search
        </h1>
        <p className="text-xs text-slate-500">
          Search across Doctors, Patients, Appointments, Prescriptions, and Financial Ledgers.
        </p>
      </div>

      {/* SEARCH INPUT */}
      <Card className="p-4 border-slate-200 bg-white rounded-2xl shadow-md">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type query to search platform (e.g. Jenkins, Anita, APP-77102, Cardiology)..."
            className="pl-11 py-3 text-sm rounded-xl border-slate-300 focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </Card>

      {/* SEARCH RESULTS DISPLAY */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Searching master directory...</div>
      ) : data && (
        <div className="space-y-6">
          
          {/* DOCTORS MATCHED */}
          {data.doctors.length > 0 && (
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-purple-600" /> Doctors Matched ({data.doctors.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {data.doctors.map((d) => (
                  <div key={d.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{d.fullName}</span>
                      <span className="text-slate-500 ml-2 font-mono text-[11px]">({d.specialization})</span>
                    </div>
                    <Link href={`/super-admin/doctors/${d.id}`} className="text-purple-600 hover:underline font-bold flex items-center gap-1">
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PATIENTS MATCHED */}
          {data.patients.length > 0 && (
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-teal-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" /> Patients Matched ({data.patients.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {data.patients.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{p.fullName}</span>
                      <span className="text-slate-500 ml-2 font-mono text-[11px]">#{p.id}</span>
                    </div>
                    <Link href={`/super-admin/patients/${p.id}`} className="text-teal-600 hover:underline font-bold flex items-center gap-1">
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* APPOINTMENTS MATCHED */}
          {data.appointments.length > 0 && (
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" /> Appointments Matched ({data.appointments.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {data.appointments.map((a) => (
                  <div key={a.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{a.id}</span>
                      <span className="text-slate-500 ml-2">{a.patientName} ↔ {a.doctorName}</span>
                    </div>
                    <Link href={`/super-admin/appointments/${a.id}`} className="text-slate-700 hover:underline font-bold flex items-center gap-1">
                      Inspect <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      )}

    </div>
  )
}
