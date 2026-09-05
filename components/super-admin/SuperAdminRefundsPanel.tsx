'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RefreshCw, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { processSuperAdminRefund } from '@/lib/financial/financial-client'

export const SuperAdminRefundsPanel: React.FC = () => {
  const [paymentId, setPaymentId] = useState('PAY-88190-01')
  const [reason, setReason] = useState('Patient requested cancellation within eligible timeframe')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const success = await processSuperAdminRefund(paymentId, reason)
    if (success) {
      setMessage(`Refund for payment ${paymentId} successfully processed and recorded in ledger.`)
    } else {
      setMessage('Failed to process refund.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Master Financial Control
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Patient Refund Management Center
        </h1>
        <p className="text-xs text-slate-500">
          Initiate verified payment refunds with ledger adjustment and patient notification.
        </p>
      </div>

      {message && (
        <div role="alert" className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {message}
        </div>
      )}

      {/* REFUND FORM */}
      <Card className="p-6 sm:p-8 border-slate-200 bg-white rounded-2xl space-y-6 shadow-xl">
        <form onSubmit={handleRefund} className="space-y-4 text-xs">
          <Input
            label="Payment / Transaction ID *"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Refund Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State legitimate reason for initiating refund..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[90px]"
              required
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-extrabold">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> Ledger Reversal Safeguard
            </div>
            <p className="text-[11px] text-amber-800">
              Processing a refund appends an immutable `REFUND` transaction entry (-₹5.00 INR) in the financial ledger and adjusts the doctor&apos;s earnings calculation safely.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="teal"
              size="sm"
              disabled={isSubmitting}
              className="font-bold text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {isSubmitting ? 'Processing Refund...' : 'Initiate Refund (₹5.00 INR)'}
            </Button>
          </div>
        </form>
      </Card>

    </div>
  )
}
