import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminFinancialPanel } from '@/components/super-admin/SuperAdminFinancialPanel'

export const metadata: Metadata = {
  title: 'Master Financial Operations | Super Admin Console',
  description: 'Master platform oversight of gross revenue, doctor earnings, and transaction ledgers.',
}

export default function SuperAdminFinancialPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminFinancialPanel />
    </AdminDashboardLayout>
  )
}
