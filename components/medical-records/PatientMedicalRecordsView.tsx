'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, FileSpreadsheet, Plus, Search, Calendar, ArrowRight, ShieldCheck, Download } from 'lucide-react'
import { Prescription } from '@/types/prescription'
import { MedicalDocument } from '@/types/medical-record'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fetchPatientMedicalRecords } from '@/lib/medical-records/medical-records-client'
import { MedicalDocumentUploadModal } from './MedicalDocumentUploadModal'

export const PatientMedicalRecordsView: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [documents, setDocuments] = useState<MedicalDocument[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRESCRIPTIONS' | 'DOCUMENTS'>('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const loadRecords = async () => {
    setIsLoading(true)
    const res = await fetchPatientMedicalRecords()
    setPrescriptions(res.prescriptions)
    setDocuments(res.documents)
    setIsLoading(false)
  }

  useEffect(() => {
    loadRecords()
  }, [])

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDocuments = documents.filter(
    (d) =>
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <FileText className="w-3.5 h-3.5 text-teal-600" /> Patient Medical Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            My Medical Records & Prescriptions
          </h1>
          <p className="text-xs text-slate-500">
            Access issued digital prescriptions, diagnostic lab reports, and clinical consultation history.
          </p>
        </div>

        <Button
          variant="teal"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          className="font-bold text-xs gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload Medical Document
        </Button>
      </div>

      {/* SEARCH BAR & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
          {['ALL', 'PRESCRIPTIONS', 'DOCUMENTS'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2.5 border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'ALL'
                ? `All Records (${prescriptions.length + documents.length})`
                : tab === 'PRESCRIPTIONS'
                ? `Prescriptions (${prescriptions.length})`
                : `Lab Documents (${documents.length})`}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records or doctor..."
            className="text-xs py-2"
          />
        </div>
      </div>

      {/* RECORDS CONTENT */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-slate-500">Loading medical records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* PRESCRIPTIONS SECTION */}
          {(activeTab === 'ALL' || activeTab === 'PRESCRIPTIONS') && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" /> Digital Prescriptions ({filteredPrescriptions.length})
              </h3>

              {filteredPrescriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPrescriptions.map((prx) => (
                    <Card key={prx.id} className="p-5 border-slate-200 bg-white rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-400 block font-mono">#{prx.id}</span>
                          <h4 className="text-sm font-extrabold text-slate-900">{prx.doctorName}</h4>
                          <p className="text-xs text-teal-700 font-semibold">{prx.doctorSpecialty || 'Specialist'}</p>
                        </div>
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                          {prx.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnosis</span>
                        <p className="font-semibold text-slate-900 line-clamp-1">{prx.diagnosis}</p>
                        <p className="text-[11px] text-slate-500">{prx.medications.length} Medications Prescribed</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(prx.issuedAt || prx.createdAt).toLocaleDateString()}
                        </span>

                        <Link href={`/patient/prescriptions/${prx.id}`}>
                          <Button variant="teal" size="sm" className="font-bold text-xs gap-1">
                            View & Print Rx <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center text-xs text-slate-500">No prescriptions found.</Card>
              )}
            </div>
          )}

          {/* DOCUMENTS SECTION */}
          {(activeTab === 'ALL' || activeTab === 'DOCUMENTS') && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-600" /> Lab & Diagnostic Documents ({filteredDocuments.length})
              </h3>

              {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="p-5 border-slate-200 bg-white rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{doc.documentType}</span>
                          <h4 className="text-sm font-extrabold text-slate-900">{doc.fileName}</h4>
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                        </span>

                        <Button variant="outline" size="sm" className="font-bold text-xs gap-1">
                          <Download className="w-3.5 h-3.5" /> Download
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center text-xs text-slate-500">No diagnostic documents uploaded.</Card>
              )}
            </div>
          )}

        </div>
      )}

      {/* UPLOAD MODAL */}
      <MedicalDocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={loadRecords}
      />

    </div>
  )
}
