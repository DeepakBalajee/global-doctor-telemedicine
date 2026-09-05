import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { Card } from '@/components/ui/Card'
import { CreditCard, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Payment Transaction Receipts (₹5) | Admin Portal',
  description: 'View safe consultation payment receipts. Gateway secrets & credentials strictly protected.',
}

export default function AdminPaymentsPage() {
  return (
    <AdminDashboardLayout role="ADMIN">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Financial Receipts
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Payment Receipts (₹5.00 INR)
          </h1>
          <p className="text-xs text-slate-500">
            View verified transaction reference IDs. Gateway private keys, card CVVs, and payment secrets remain strictly server-side.
          </p>
        </div>

        <Card className="p-8 text-center space-y-3 bg-white border-slate-200 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Razorpay Payment Receipts Verified</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All consultation payments are strictly fixed at ₹5.00 INR (500 paise) and verified via HMAC-SHA256 signatures on the backend.
          </p>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
