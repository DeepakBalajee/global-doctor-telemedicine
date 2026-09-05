'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, FileText, ArrowRight, Printer, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchPatientPayments } from '@/lib/financial/financial-client'

export const PatientPaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const list = await fetchPatientPayments()
      setPayments(list)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
          <CreditCard className="w-3.5 h-3.5 text-teal-600" /> Patient Billing & Payments
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Payment History & Digital Receipts
        </h1>
        <p className="text-xs text-slate-500">
          View verified consultation receipts and payment transaction records.
        </p>
      </div>

      {/* PAYMENTS TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Payment Receipts ({payments.length})
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading payment receipts...</div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Receipt ID</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Gateway Txn ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3 font-semibold">{p.doctorName}</td>
                    <td className="p-3 font-extrabold text-emerald-800">₹{p.amount.toFixed(2)} INR</td>
                    <td className="p-3 font-mono text-slate-500">{p.gatewayTransactionId}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/patient/payments/${p.id}/receipt`}>
                        <Button variant="outline" size="sm" className="font-bold text-[11px] gap-1">
                          <Printer className="w-3 h-3 text-teal-600" /> Receipt
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">No payment receipts found.</div>
        )}
      </Card>

    </div>
  )
}
