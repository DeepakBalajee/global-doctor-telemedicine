import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminSettingsView } from '@/components/super-admin/SuperAdminSettingsView'

export const metadata: Metadata = {
  title: 'Master Platform Control & Settings | Super Admin Console',
  description: 'Global platform configuration, registration rules, security policy, and maintenance mode.',
}

export default function SuperAdminSettingsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminSettingsView />
    </AdminDashboardLayout>
  )
}
