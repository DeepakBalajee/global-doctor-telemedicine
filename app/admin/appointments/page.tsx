import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { Card } from '@/components/ui/Card'
import { Calendar, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Platform Appointments | Admin Portal',
  description: 'View operational platform appointments and status metrics.',
}

export default function AdminAppointmentsPage() {
  return (
    <AdminDashboardLayout role="ADMIN">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <Calendar className="w-3.5 h-3.5 text-teal-600" /> Platform Operations
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Consultation Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Operational overview of platform consultation sessions. Administrative actions follow strict business controls.
          </p>
        </div>

        <Card className="p-8 text-center space-y-3 bg-white border-slate-200 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-teal-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Operational Appointments Active</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Operational appointments are actively tracked in backend stores. Direct state modifications are strictly guarded to preserve medical state machine integrity.
          </p>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
