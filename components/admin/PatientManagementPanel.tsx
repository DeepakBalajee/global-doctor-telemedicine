'use client'

import React, { useState, useEffect } from 'react'
import { Users, Search, CheckCircle2, ShieldCheck, UserX } from 'lucide-react'
import { PatientProfile } from '@/types/patient-auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getAdminPatients } from '@/lib/admin/admin-client'

export const PatientManagementPanel: React.FC = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPatients() {
      setIsLoading(true)
      const res = await getAdminPatients()
      setPatients(res)
      setIsLoading(false)
    }
    loadPatients()
  }, [])

  const filteredPatients = patients.filter((p) =>
    searchQuery
      ? p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
            <Users className="w-3.5 h-3.5 text-brand-600" /> Patient Account Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Patient Directory & Account Controls
          </h1>
          <p className="text-xs text-slate-500">
            View operational patient accounts, registration details, and manage account active/suspended state. Sensitive passwords and medical records are strictly protected.
          </p>
        </div>

        <Input
          placeholder="Search patient name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
          className="w-full sm:w-60 text-xs"
        />
      </div>

      {/* PATIENTS TABLE */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-slate-500">Loading patient directory...</p>
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="space-y-3">
          {filteredPatients.map((pat) => (
            <Card key={pat.id} className="p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{pat.fullName}</span>
                      <span className="font-mono text-slate-400 text-[10px]">ID: {pat.id}</span>
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                        ACTIVE
                      </span>
                    </div>

                    <p className="text-slate-600">
                      Email: <strong>{pat.email}</strong> • Mobile: <strong>{pat.mobileNumber}</strong>
                    </p>
                    <p className="text-slate-500">
                      DOB: <strong>{pat.dateOfBirth} ({pat.age} yrs)</strong> • Gender: <strong>{pat.gender}</strong> • Location: <strong>{pat.city}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200 gap-1"
                  >
                    <UserX className="w-3.5 h-3.5" /> Suspend
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center space-y-3 max-w-md mx-auto">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Patient Accounts Found</h3>
        </Card>
      )}

    </div>
  )
}
