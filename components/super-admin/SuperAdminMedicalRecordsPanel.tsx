'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Search, ShieldCheck, ArrowRight, Eye, Ban, RotateCcw } from 'lucide-react'
import { Prescription } from '@/types/prescription'
import { MedicalDocument } from '@/types/medical-record'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fetchSuperAdminPrescriptions, fetchSuperAdminDocuments, revokeSuperAdminPrescription } from '@/lib/medical-records/medical-records-client'

export const SuperAdminMedicalRecordsPanel: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [documents, setDocuments] = useState<MedicalDocument[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadMasterRecords = async () => {
    setIsLoading(true)
    const prxList = await fetchSuperAdminPrescriptions()
    const docList = await fetchSuperAdminDocuments()
    setPrescriptions(prxList)
    setDocuments(docList)
    setIsLoading(false)
  }

  useEffect(() => {
    loadMasterRecords()
  }, [])

  const handleRevoke = async (id: string) => {
    await revokeSuperAdminPrescription(id)
    loadMasterRecords()
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Master Platform Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Platform-Wide Medical Records & Prescriptions Oversight
          </h1>
          <p className="text-xs text-slate-500">
            Super Admin master directory of all digital prescriptions and medical documents across the platform.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="w-full sm:w-72">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient, doctor, or diagnosis..."
          className="text-xs py-2"
        />
      </div>

      {/* PRESCRIPTIONS OVERVIEW TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Master Digital Prescriptions Directory ({prescriptions.length})
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading master prescriptions...</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Rx ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Diagnosis</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {prescriptions.map((prx) => (
                  <tr key={prx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{prx.id}</td>
                    <td className="p-3 font-semibold">{prx.patientName}</td>
                    <td className="p-3 text-slate-700">{prx.doctorName}</td>
                    <td className="p-3 text-slate-600 line-clamp-1">{prx.diagnosis}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prx.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                      }`}>
                        {prx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link href={`/patient/prescriptions/${prx.id}`}>
                        <Button variant="outline" size="sm" className="font-bold text-[11px] gap-1">
                          <Eye className="w-3 h-3 text-teal-600" /> View
                        </Button>
                      </Link>

                      {prx.status === 'ISSUED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevoke(prx.id)}
                          className="font-bold text-[11px] gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Ban className="w-3 h-3" /> Revoke
                        </Button>
                      )}
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
