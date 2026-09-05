'use client'

import React, { useState } from 'react'
import { CreditCard, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { requestDoctorPayout } from '@/lib/financial/financial-client'

export interface DoctorPayoutModalProps {
  isOpen: boolean
  availableBalance: number
  onClose: () => void
  onSuccess: () => void
}

export const DoctorPayoutModal: React.FC<DoctorPayoutModalProps> = ({
  isOpen,
  availableBalance,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState(availableBalance > 0 ? availableBalance.toString() : '4.5')
  const [payoutMethod, setPayoutMethod] = useState('HDFC Bank (A/C ***9901)')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid payout amount.')
      return
    }

    if (numAmount > availableBalance) {
      setError(`Amount exceeds your available balance of ₹${(Number(availableBalance) || 0).toFixed(2)}.`)
      return
    }

    setError(null)
    setIsSubmitting(true)

    const res = await requestDoctorPayout({
      amount: numAmount,
      payoutMethod,
    })

    if (res.success) {
      onSuccess()
      onClose()
    } else {
      setError(res.error || 'Failed to submit payout request.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <Card className="p-6 max-w-md w-full bg-white border-slate-200 rounded-2xl space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-extrabold text-slate-900">Request Earnings Payout</h3>
          </div>

          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Available for Payout</span>
            <span className="text-xl font-black text-teal-900">₹{(Number(availableBalance) || 0).toFixed(2)} INR</span>
          </div>

          <Input
            label="Payout Amount (INR) *"
            type="number"
            step="0.5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Payout Method *</label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="HDFC Bank (A/C ***9901)">HDFC Bank (A/C ***9901)</option>
              <option value="UPI: sarah.jenkins@okaxis">UPI: sarah.jenkins@okaxis</option>
              <option value="ICICI Direct Deposit">ICICI Direct Deposit</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs font-semibold">
              Cancel
            </Button>

            <Button
              type="submit"
              variant="teal"
              size="sm"
              disabled={isSubmitting || availableBalance <= 0}
              className="text-xs font-bold gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" /> {isSubmitting ? 'Submitting...' : 'Submit Payout Request'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
