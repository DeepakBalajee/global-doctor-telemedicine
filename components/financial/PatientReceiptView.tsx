'use client'

import React from 'react'
import Link from 'next/link'
import { Printer, ArrowLeft, ShieldCheck, CreditCard, Stethoscope } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface PatientReceiptViewProps {
  payment: any
}

export const PatientReceiptView: React.FC<PatientReceiptViewProps> = ({ payment }) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      
      {/* ACTIONS BAR */}
      <div className="print:hidden flex items-center justify-between border-b border-slate-200 pb-4">
        <Link href="/patient/payments" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Payments
        </Link>

        <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-bold gap-1.5">
          <Printer className="w-4 h-4 text-teal-600" /> Print / Save PDF Receipt
        </Button>
      </div>

      {/* OFFICIAL PRINTABLE RECEIPT */}
      <Card className="p-8 sm:p-10 border-slate-200 bg-white rounded-2xl shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
        
        {/* CLINIC HEADER */}
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
            <p className="text-xs text-slate-500">Official Payment Transaction Receipt</p>
            <p className="text-[10px] text-slate-400 font-mono">Receipt ID: #{payment.id}</p>
          </div>

          <div className="text-left sm:text-right space-y-0.5 text-xs text-slate-700">
            <p className="font-extrabold text-slate-900">Payment Status: <span className="text-emerald-700">{payment.status}</span></p>
            <p className="text-[11px] text-slate-500">Date: {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Patient Name</span>
            <span className="font-extrabold text-slate-900">{payment.patientName}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Doctor Assigned</span>
            <span className="font-extrabold text-slate-900">{payment.doctorName}</span>
          </div>
        </div>

        {/* LINE ITEMS TABLE */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Summary</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Telemedicine Consultation Fee</td>
                  <td className="p-3">{payment.gateway}</td>
                  <td className="p-3 font-mono text-slate-500">{payment.gatewayTransactionId}</td>
                  <td className="p-3 text-right font-black text-slate-900">₹{payment.amount.toFixed(2)} INR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL */}
        <div className="flex justify-end pt-2 text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 block">Total Amount Paid</span>
            <span className="text-2xl font-black text-emerald-800">₹{payment.amount.toFixed(2)} INR</span>
          </div>
        </div>

      </Card>
    </div>
  )
}
