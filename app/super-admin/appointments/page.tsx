import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { Card } from '@/components/ui/Card'
import { Calendar, Crown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Master Appointments Oversight | Super Admin Console',
  description: 'Platform-wide appointment tracking and state machine oversight.',
}

export default function SuperAdminAppointmentsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> Master Platform Operations
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Appointments Oversight
          </h1>
          <p className="text-xs text-slate-500">
            Platform-wide appointment oversight across all medical specialties and general practice sessions.
          </p>
        </div>

        <Card className="p-8 text-center space-y-3 bg-white border-slate-200 rounded-2xl">
          <Crown className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Platform Appointments Active</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Operational appointments are actively tracked across all verified doctors. State transitions follow strict medical state machine rules.
          </p>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
