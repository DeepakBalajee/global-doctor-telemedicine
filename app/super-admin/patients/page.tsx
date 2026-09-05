import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminPatientsPanel } from '@/components/super-admin/SuperAdminPatientsPanel'

export const metadata: Metadata = {
  title: 'Master Patient Oversight | Super Admin Console',
  description: 'Platform-wide patient accounts oversight with strict data minimization safeguards.',
}

export default function SuperAdminPatientsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminPatientsPanel />
    </AdminDashboardLayout>
  )
}
