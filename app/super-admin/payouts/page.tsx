import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminPayoutsPanel } from '@/components/super-admin/SuperAdminPayoutsPanel'

export const metadata: Metadata = {
  title: 'Doctor Payout Approvals | Super Admin Console',
  description: 'Master platform oversight and approval of doctor payout requests.',
}

export default function SuperAdminPayoutsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminPayoutsPanel />
    </AdminDashboardLayout>
  )
}
