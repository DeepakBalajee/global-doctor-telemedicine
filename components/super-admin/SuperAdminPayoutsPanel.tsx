'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, CheckCircle2, Ban, ShieldCheck, ArrowLeft } from 'lucide-react'
import { DoctorPayout } from '@/types/financial'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchSuperAdminFinancial, processSuperAdminPayout } from '@/lib/financial/financial-client'

export const SuperAdminPayoutsPanel: React.FC = () => {
  const [payouts, setPayouts] = useState<DoctorPayout[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadPayouts = async () => {
    setIsLoading(true)
    const res = await fetchSuperAdminFinancial()
    setPayouts(res.payouts)
    setIsLoading(false)
  }

  useEffect(() => {
    loadPayouts()
  }, [])

  const handleAction = async (id: string, status: string) => {
    await processSuperAdminPayout(id, status, 'UPI-REF-MANUAL-SA')
    loadPayouts()
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Master Financial Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Doctor Payout Approvals & Management
          </h1>
          <p className="text-xs text-slate-500">
            Review and process doctor withdrawal requests to bank accounts or UPI.
          </p>
        </div>
      </div>

      {/* PAYOUTS TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Doctor Payout Requests ({payouts.length})
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading payout requests...</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Payout ID</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payout Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3 font-semibold">{p.doctorName}</td>
                    <td className="p-3 font-extrabold text-teal-800">₹{p.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-700">{p.payoutMethod}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {p.status === 'PENDING' && (
                        <>
                          <Button
                            variant="teal"
                            size="sm"
                            onClick={() => handleAction(p.id, 'COMPLETED')}
                            className="font-bold text-[11px] gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payout
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(p.id, 'REJECTED')}
                            className="font-bold text-[11px] gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Ban className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </>
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
