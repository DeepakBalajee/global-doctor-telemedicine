import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SystemHealthPanel } from '@/components/super-admin/SystemHealthPanel'

export const metadata: Metadata = {
  title: 'System Operational Health | Super Admin Console',
  description: 'Real-time operational indicators for API, database, auth, and payment services.',
}

export default function SuperAdminSystemHealthPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SystemHealthPanel />
    </AdminDashboardLayout>
  )
}
