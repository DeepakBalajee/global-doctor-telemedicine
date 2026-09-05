'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, UserCheck, Eye, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fetchPatientSearchResults } from '@/lib/search/search-client'

export const AdminPatientSearchPanel: React.FC = () => {
  const [query, setQuery] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const res = await fetchPatientSearchResults({ query })
      setPatients(res?.results || [])
      setIsLoading(false)
    }
    load()
  }, [query])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
          <UserCheck className="w-3.5 h-3.5 text-brand-600" /> Patient Search Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Admin Patient Directory & Search
        </h1>
        <p className="text-xs text-slate-500">
          Search patient accounts with strict data minimization safeguards.
        </p>
      </div>

      {/* SEARCH BAR */}
      <Card className="p-4 border-slate-200 bg-white rounded-2xl shadow-sm">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name or ID (e.g. Anita Sharma, PAT-88190)..."
            className="pl-10 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </Card>

      {/* PATIENTS TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Patient Directory ({patients.length})
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Searching patients...</div>
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3 font-bold text-slate-900">{p.fullName}</td>
                    <td className="p-3">{p.gender}</td>
                    <td className="p-3 text-slate-600">{p.location}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        {p.accountStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/super-admin/patients/${p.id}`}>
                        <Button variant="outline" size="sm" className="font-bold text-[11px] gap-1">
                          <Eye className="w-3 h-3 text-teal-600" /> View Account
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">No patient accounts match your search.</div>
        )}
      </Card>

    </div>
  )
}
