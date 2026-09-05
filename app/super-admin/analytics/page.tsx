import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminAnalyticsView } from '@/components/analytics/SuperAdminAnalyticsView'

export const metadata: Metadata = {
  title: 'Advanced Analytics Center | Super Admin Console',
  description: 'Master platform analytics, revenue allocation, and security insights.',
}

export default function SuperAdminAnalyticsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminAnalyticsView />
    </AdminDashboardLayout>
  )
}
