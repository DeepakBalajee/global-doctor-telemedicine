'use client'

import React, { useState, useEffect } from 'react'
import { Stethoscope, CheckCircle2, AlertTriangle, XCircle, Search, ShieldCheck, UserX, UserCheck } from 'lucide-react'
import { DoctorProfile } from '@/types/doctor'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  getAdminDoctors,
  approveDoctor,
  rejectDoctor,
  suspendDoctor,
  activateDoctor,
} from '@/lib/admin/admin-client'

export const SuperAdminDoctorsPanel: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'SUSPENDED'>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadDoctors = async () => {
    setIsLoading(true)
    const res = await getAdminDoctors()
    setDoctors(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const handleApprove = async (docId: string) => {
    setMessage(null)
    const res = await approveDoctor(docId)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || `Doctor ${docId} approved and verified.` })
      loadDoctors()
    } else {
      setMessage({ type: 'error', text: res.message || 'Approval failed.' })
    }
  }

  const handleReject = async (docId: string) => {
    setMessage(null)
    const res = await rejectDoctor(docId, 'Credentials incomplete')
    if (res.success) {
      setMessage({ type: 'success', text: res.message || `Doctor ${docId} verification rejected.` })
      loadDoctors()
    } else {
      setMessage({ type: 'error', text: res.message || 'Rejection failed.' })
    }
  }

  const handleSuspend = async (docId: string) => {
    setMessage(null)
    const res = await suspendDoctor(docId, 'Super Admin action')
    if (res.success) {
      setMessage({ type: 'success', text: res.message || `Doctor ${docId} account suspended.` })
      loadDoctors()
    } else {
      setMessage({ type: 'error', text: res.message || 'Suspension failed.' })
    }
  }

  const handleActivate = async (docId: string) => {
    setMessage(null)
    const res = await activateDoctor(docId)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || `Doctor ${docId} account reactivated.` })
      loadDoctors()
    } else {
      setMessage({ type: 'error', text: res.message || 'Reactivation failed.' })
    }
  }

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = searchQuery
      ? doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'PENDING'
        ? doc.verificationStatus === 'PENDING'
        : statusFilter === 'VERIFIED'
        ? doc.verificationStatus === 'VERIFIED'
        : doc.accountStatus === 'SUSPENDED'

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <Stethoscope className="w-3.5 h-3.5 text-amber-600" /> Super Admin Doctor Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Master Doctor Oversight & Accounts
          </h1>
          <p className="text-xs text-slate-500">
            Platform-wide doctor oversight. Approve applications, suspend accounts, or reactivate suspended medical practitioners.
          </p>
        </div>

        <Input
          placeholder="Search name or license..."
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

      {/* STATUS TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        {(['ALL', 'PENDING', 'VERIFIED', 'SUSPENDED'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2.5 border-b-2 transition-all ${
              statusFilter === st
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {st === 'ALL' ? 'All Doctors' : st === 'PENDING' ? 'Pending Review' : st === 'VERIFIED' ? 'Verified & Active' : 'Suspended'}
          </button>
        ))}
      </div>

      {/* DOCTORS TABLE / LIST */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-7 w-7 text-amber-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-slate-500">Loading master doctor directory...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="space-y-3">
          {filteredDoctors.map((doc) => (
            <Card key={doc.id} className="p-5 border-slate-200 bg-white rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 font-bold">
                    <Stethoscope className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{doc.fullName}</span>
                      <span className="text-xs font-mono text-slate-400">Lic: {doc.licenseNumber}</span>
                      
                      {doc.verificationStatus === 'VERIFIED' && (
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                          VERIFIED
                        </span>
                      )}
                      {doc.verificationStatus === 'PENDING' && (
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          PENDING REVIEW
                        </span>
                      )}
                      {doc.accountStatus === 'SUSPENDED' && (
                        <span className="text-[10px] font-bold uppercase bg-red-100 text-red-900 px-2 py-0.5 rounded-md">
                          SUSPENDED
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      {doc.doctorType === 'SPECIALIST' ? `Specialist (${doc.specialtyName})` : 'General Physician'} • {doc.medicalQualification} ({doc.experienceYears} Yrs Exp)
                    </p>
                    <p className="text-xs text-slate-500">
                      Authority: <strong>{doc.licensingAuthority}</strong> • Location: <strong>{doc.city}, {doc.state}</strong>
                    </p>
                  </div>
                </div>

                {/* SUPER ADMIN ACTIONS */}
                <div className="flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {doc.verificationStatus === 'PENDING' && (
                    <>
                      <Button
                        variant="teal"
                        size="sm"
                        onClick={() => handleApprove(doc.id)}
                        className="text-xs font-bold gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(doc.id)}
                        className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200 gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </>
                  )}

                  {doc.verificationStatus === 'VERIFIED' && doc.accountStatus === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuspend(doc.id)}
                      className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200 gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" /> Suspend
                    </Button>
                  )}

                  {doc.accountStatus === 'SUSPENDED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivate(doc.id)}
                      className="text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border-emerald-200 gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Reactivate Doctor
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center space-y-3 max-w-md mx-auto">
          <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Doctors Found</h3>
        </Card>
      )}

    </div>
  )
}
