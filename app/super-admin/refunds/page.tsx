import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminRefundsPanel } from '@/components/super-admin/SuperAdminRefundsPanel'

export const metadata: Metadata = {
  title: 'Patient Refund Management | Super Admin Console',
  description: 'Master platform oversight of consultation refunds and ledger reversals.',
}

export default function SuperAdminRefundsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminRefundsPanel />
    </AdminDashboardLayout>
  )
}
