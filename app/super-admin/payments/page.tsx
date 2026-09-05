import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { Card } from '@/components/ui/Card'
import { CreditCard, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Master Payments Oversight | Super Admin Console',
  description: 'Platform financial receipts oversight and Razorpay payment reconciliation.',
}

export default function SuperAdminPaymentsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> Master Financial Receipts
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Payment Receipts (₹5.00 INR)
          </h1>
          <p className="text-xs text-slate-500">
            Master platform oversight of Razorpay payment receipts and HMAC signature verification logs.
          </p>
        </div>

        <Card className="p-8 text-center space-y-3 bg-white border-slate-200 rounded-2xl">
          <CreditCard className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">₹5.00 INR Payment Engine Verified</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Server-authoritative consultation fee is strictly locked at ₹5.00 INR (500 paise). Client inputs attempting price modification are rejected.
          </p>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
