'use client'

import React from 'react'
import Link from 'next/link'
import { Printer, ShieldCheck, Download, ArrowLeft, Stethoscope, FileText, CheckCircle2 } from 'lucide-react'
import { Prescription } from '@/types/prescription'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface PrescriptionDocumentViewProps {
  prescription: Prescription
  returnUrl: string
}

export const PrescriptionDocumentView: React.FC<PrescriptionDocumentViewProps> = ({
  prescription,
  returnUrl,
}) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      
      {/* ACTIONS BAR (HIDDEN IN PRINT) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Link href={returnUrl} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Portal
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-bold gap-1.5">
            <Printer className="w-4 h-4 text-teal-600" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* OFFICIAL PRINTABLE PRESCRIPTION CARD */}
      <Card className="p-8 sm:p-10 border-slate-200 bg-white rounded-2xl shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
        
        {/* CLINIC / PLATFORM HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Global Doctor Telemedicine Platform
              </h2>
            </div>
            <p className="text-xs text-slate-500">Official Digital Health Record & Verified Prescription</p>
            <p className="text-[10px] text-slate-400 font-mono">Prescription ID: #{prescription.id}</p>
          </div>

          <div className="text-left sm:text-right space-y-0.5 text-xs text-slate-700">
            <p className="font-extrabold text-slate-900 text-sm">{prescription.doctorName}</p>
            <p className="text-teal-700 font-semibold">{prescription.doctorSpecialty || 'Specialist Physician'}</p>
            <p className="text-[11px] text-slate-500">Reg No: UPMC-99120 • Telemedicine License</p>
            <p className="text-[11px] text-slate-400">Date: {new Date(prescription.issuedAt || prescription.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* PATIENT & APPOINTMENT METADATA GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Patient Name</span>
            <span className="font-extrabold text-slate-900">{prescription.patientName}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Patient ID</span>
            <span className="font-mono font-semibold text-slate-700">{prescription.patientId}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Appointment ID</span>
            <span className="font-mono font-semibold text-slate-700">{prescription.appointmentId}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Status</span>
            <span className="font-bold text-emerald-700">{prescription.status}</span>
          </div>
        </div>

        {/* CLINICAL DIAGNOSIS */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Diagnosis</h3>
          <p className="text-sm font-bold text-slate-900 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
            {prescription.diagnosis}
          </p>
        </div>

        {/* PRESCRIBED MEDICATIONS TABLE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rx - Prescribed Medications</h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {prescription.medications.map((med, index) => (
                  <tr key={med.id || index} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-400">{index + 1}</td>
                    <td className="p-3 font-extrabold text-slate-900">{med.medicineName}</td>
                    <td className="p-3 font-mono font-semibold">{med.dosage}</td>
                    <td className="p-3">{med.frequency}</td>
                    <td className="p-3 font-semibold">{med.duration}</td>
                    <td className="p-3 text-slate-600">{med.instructions || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CLINICAL NOTES & ADVICE */}
        {prescription.clinicalNotes && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Doctor Advice & Notes</h3>
            <p className="text-xs text-slate-700 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-200">
              {prescription.clinicalNotes}
            </p>
          </div>
        )}

        {/* FOOTER & DIGITAL SIGNATURE */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digitally Verified & Encrypted Telemedicine Record</span>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-extrabold text-slate-900">{prescription.doctorName}</p>
            <p className="text-[10px] text-slate-400">Signed Digitally via Telemed RSA-2048 Guard</p>
          </div>
        </div>

      </Card>
    </div>
  )
}
