'use client'

import React, { useState, useEffect } from 'react'
import { Users, Search, CheckCircle2, UserX, UserCheck } from 'lucide-react'
import { PatientProfile } from '@/types/patient-auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  getAdminPatients,
  suspendPatient,
  activatePatient,
} from '@/lib/admin/admin-client'

export const SuperAdminPatientsPanel: React.FC = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadPatients = async () => {
    setIsLoading(true)
    const res = await getAdminPatients()
    setPatients(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleSuspend = async (patId: string) => {
    setMessage(null)
    const res = await suspendPatient(patId)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || `Patient ${patId} account suspended.` })
      loadPatients()
    } else {
      setMessage({ type: 'error', text: res.message || 'Suspension failed.' })
    }
  }

  const handleActivate = async (patId: string) => {
    setMessage(null)
    const res = await activatePatient(patId)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || `Patient ${patId} account reactivated.` })
      loadPatients()
    } else {
      setMessage({ type: 'error', text: res.message || 'Reactivation failed.' })
    }
  }

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
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <Users className="w-3.5 h-3.5 text-amber-600" /> Super Admin Patient Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Master Patient Account Administration
          </h1>
          <p className="text-xs text-slate-500">
            Platform-wide patient accounts oversight. Minimum privilege and data minimization enforced (passwords and raw clinical records excluded).
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

      {/* MESSAGE BANNER */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* PATIENTS TABLE */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-7 w-7 text-amber-500" viewBox="0 0 24 24" fill="none">
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
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          pat.isSuspended || pat.isActive === false
                            ? 'bg-red-100 text-red-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {pat.isSuspended || pat.isActive === false ? 'SUSPENDED' : 'ACTIVE'}
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
                  {pat.isSuspended || pat.isActive === false ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivate(pat.id)}
                      className="text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Activate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuspend(pat.id)}
                      className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200 gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" /> Suspend
                    </Button>
                  )}
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
