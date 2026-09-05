'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { DollarSign, CreditCard, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react'
import { FinancialTransaction, DoctorPayout } from '@/types/financial'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchSuperAdminFinancial } from '@/lib/financial/financial-client'

export const SuperAdminFinancialPanel: React.FC = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [payouts, setPayouts] = useState<DoctorPayout[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchSuperAdminFinancial()
      setTransactions(res.transactions)
      setPayouts(res.payouts)
      setTotalRevenue(res.totalRevenue)
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Master Platform Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Platform Financial Operations & Revenue Control
          </h1>
          <p className="text-xs text-slate-500">
            Platform gross revenue, doctor payouts, transaction ledgers, and refund controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/super-admin/payouts">
            <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-teal-600" /> Doctor Payouts
            </Button>
          </Link>

          <Link href="/super-admin/refunds">
            <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Patient Refunds
            </Button>
          </Link>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">Total Gross Revenue</span>
          <div className="text-2xl font-black text-emerald-700">₹{totalRevenue.toFixed(2)} INR</div>
          <p className="text-[11px] text-slate-500">Fee Rate: ₹5.00 INR per consultation</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">Platform Share (10%)</span>
          <div className="text-2xl font-black text-slate-900">₹{(totalRevenue * 0.1).toFixed(2)} INR</div>
          <p className="text-[11px] text-slate-500">Net Platform Revenue</p>
        </Card>

        <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">Doctor Share (90%)</span>
          <div className="text-2xl font-black text-teal-700">₹{(totalRevenue * 0.9).toFixed(2)} INR</div>
          <p className="text-[11px] text-slate-500">Allocated Doctor Net Earnings</p>
        </Card>
      </div>

      {/* MASTER TRANSACTIONS LEDGER TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Master Financial Transaction Ledger ({transactions.length})
        </h3>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading master ledger...</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Reference / Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{t.id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.type === 'PATIENT_PAYMENT'
                          ? 'bg-emerald-100 text-emerald-900'
                          : t.type === 'PLATFORM_FEE'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-teal-100 text-teal-900'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-slate-900">₹{t.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-600 line-clamp-1">{t.reference}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{new Date(t.createdAt).toLocaleDateString()}</td>
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
