'use client'

import React from 'react'
import Link from 'next/link'
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  FileCheck,
  Lock,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface PaymentNoticeCardProps {
  consultationRequestId?: string
}

export const PaymentNoticeCard: React.FC<PaymentNoticeCardProps> = ({
  consultationRequestId = 'REQ-PREVIEW-101',
}) => {
  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="text-center space-y-2 border-b border-slate-100 pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 shadow-sm">
          <CreditCard className="h-6 w-6 stroke-[2]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Consultation / Appointment Fee
        </h2>
        <p className="text-xs text-slate-500">
          Request Reference:{' '}
          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {consultationRequestId}
          </span>
        </p>
      </div>

      {/* SUMMARY ITEMIZATION */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-2">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-brand-600" /> Service Type
          </span>
          <span className="font-bold text-slate-900">Doctor Consultation Request</span>
        </div>

        <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-2">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-600" /> Status
          </span>
          <span className="font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
            Payment Required
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-600" /> Payment Verification
          </span>
          <span className="font-medium text-slate-600">Pending Server Verification</span>
        </div>
      </div>

      {/* ₹5 FEE CARD DISPLAY */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-brand-900 to-slate-900 text-white flex items-center justify-between shadow-md">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300">
            Amount Payable
          </span>
          <h3 className="text-sm font-semibold text-slate-200">Consultation Fee</h3>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-white">₹5.00</span>
          <p className="text-[10px] text-slate-300">INR (Taxes included)</p>
        </div>
      </div>

      {/* ACTION TRIGGER PREPARED FOR UPCOMING PAYMENT PROMPT */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="h-12 font-bold text-base shadow-lg shadow-brand-600/20 gap-2"
          onClick={() => {
            alert(
              '₹5 Payment Gateway workflow will be implemented in the upcoming payment development prompt as specified.'
            )
          }}
        >
          <CreditCard className="w-5 h-5" /> Pay ₹5
        </Button>

        <p className="text-[11px] text-slate-400 text-center leading-normal">
          Payment is required before appointment confirmation. Verification is completed server-side.
        </p>
      </div>

      {/* PRIVACY & SECURITY FOOTER */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Secure Gateway Ready
        </span>
        <span className="inline-flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-brand-600" /> Encrypted Transaction
        </span>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/consultation-request"
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 underline"
        >
          ← Edit Patient Details
        </Link>
      </div>

    </Card>
  )
}
