import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminIntegrationView } from '@/components/super-admin/SuperAdminIntegrationView'

export const metadata: Metadata = {
  title: 'Integration & Data Consistency | Super Admin Console',
  description: 'Master platform integration audit console, cross-system data consistency, and referential integrity status.',
}

export default function SuperAdminIntegrationPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminIntegrationView />
    </AdminDashboardLayout>
  )
}
