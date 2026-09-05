'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { DollarSign, CreditCard, ArrowRight, History, CheckCircle2, Clock, ShieldCheck } from 'lucide-react'
import { DoctorEarningsSummary, DoctorPayout, FinancialTransaction } from '@/types/financial'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchDoctorEarnings } from '@/lib/financial/financial-client'
import { DoctorPayoutModal } from './DoctorPayoutModal'

export const DoctorEarningsView: React.FC = () => {
  const [summary, setSummary] = useState<DoctorEarningsSummary | null>(null)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [payouts, setPayouts] = useState<DoctorPayout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    const res = await fetchDoctorEarnings()
    setSummary(res.summary)
    setTransactions(res.transactions)
    setPayouts(res.payouts)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" /> Doctor Workstation Financials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Doctor Earnings & Financial Payouts
          </h1>
          <p className="text-xs text-slate-500">
            Track consultation earnings, platform revenue share (90% Doctor / 10% Platform), and withdraw funds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/doctor/earnings/history">
            <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5">
              <History className="w-3.5 h-3.5" /> Full Ledger History
            </Button>
          </Link>

          <Button
            variant="teal"
            size="sm"
            onClick={() => setIsPayoutModalOpen(true)}
            className="font-bold text-xs gap-1.5 shrink-0"
          >
            <CreditCard className="w-3.5 h-3.5" /> Request Payout
          </Button>
        </div>
      </div>

      {/* METRICS CARDS */}
      {isLoading || !summary ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading financial workstation...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Total Earnings</span>
            <div className="text-2xl font-black text-slate-900">₹{summary.totalEarnings.toFixed(2)}</div>
            <p className="text-[11px] text-slate-500">From {summary.completedConsultationsCount} Consultations</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Available Balance</span>
            <div className="text-2xl font-black text-teal-700">₹{summary.availableBalance.toFixed(2)}</div>
            <p className="text-[11px] font-semibold text-emerald-600">Eligible for instant withdrawal</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Paid Out</span>
            <div className="text-2xl font-black text-slate-900">₹{summary.paidOut.toFixed(2)}</div>
            <p className="text-[11px] text-slate-500">Transferred to Bank Account</p>
          </Card>

          <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block">Fee Model</span>
            <div className="text-2xl font-black text-slate-900">90% / 10%</div>
            <p className="text-[11px] text-slate-500">₹5.00 Fee (₹4.50 Net Earning)</p>
          </Card>
        </div>
      )}

      {/* RECENT PAYOUTS TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Payout Requests History ({payouts.length})
        </h3>

        {payouts.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="p-3">Payout ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Provider Ref</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-3 font-extrabold text-teal-800">₹{p.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-700">{p.payoutMethod}</td>
                    <td className="p-3 font-mono text-slate-500">{p.providerReference || '—'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{new Date(p.requestedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">No payout requests found.</div>
        )}
      </Card>

      {/* PAYOUT MODAL */}
      <DoctorPayoutModal
        isOpen={isPayoutModalOpen}
        availableBalance={summary?.availableBalance || 0}
        onClose={() => setIsPayoutModalOpen(false)}
        onSuccess={loadData}
      />

    </div>
  )
}
