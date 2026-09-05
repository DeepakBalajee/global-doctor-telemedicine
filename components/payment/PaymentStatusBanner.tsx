import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'

export interface PaymentStatusBannerProps {
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'VERIFYING'
  message?: string
  receiptId?: string
  transactionTime?: string
  onRetry?: () => void
}

export const PaymentStatusBanner: React.FC<PaymentStatusBannerProps> = ({
  status,
  message,
  receiptId,
  transactionTime,
  onRetry,
}) => {
  if (status === 'VERIFYING') {
    return (
      <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 flex items-center gap-3 text-xs font-semibold animate-pulse">
        <RefreshCw className="w-5 h-5 text-brand-600 animate-spin shrink-0" />
        <div>
          <p className="font-bold">Verifying Payment with Server...</p>
          <p className="text-[11px] text-brand-700 font-normal">
            Executing mandatory HMAC signature verification before appointment confirmation.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'SUCCESS') {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4 shadow-sm animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-900">Payment Successful!</h3>
            <p className="text-xs text-emerald-700">
              {message || 'Your ₹5 consultation fee has been verified and your appointment is confirmed.'}
            </p>
          </div>
        </div>

        <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200/80 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Amount Paid</span>
            <span className="font-extrabold text-emerald-900">₹5.00 INR</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Payment Status</span>
            <span className="font-extrabold text-emerald-700">Server Verified</span>
          </div>
          {receiptId && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Receipt ID</span>
              <span className="font-mono font-bold text-slate-800">{receiptId}</span>
            </div>
          )}
          {transactionTime && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Verified Time</span>
              <span className="font-medium text-slate-600">{new Date(transactionTime).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (status === 'FAILED') {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-4 shadow-sm animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/20">
            <XCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-red-900">Payment Failed</h3>
            <p className="text-xs text-red-700">
              {message || 'We couldn’t complete your payment. Please try again.'}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
          >
            Retry Payment
          </button>
        )}
      </div>
    )
  }

  if (status === 'CANCELLED') {
    return (
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">Payment Cancelled</h4>
            <p className="text-xs text-amber-700">
              {message || 'The checkout window was closed before completion. Your appointment remains pending.'}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
          >
            Return to Payment
          </button>
        )}
      </div>
    )
  }

  return null
}
