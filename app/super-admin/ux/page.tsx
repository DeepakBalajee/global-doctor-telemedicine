import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminUXConsoleView } from '@/components/super-admin/SuperAdminUXConsoleView'

export const metadata: Metadata = {
  title: 'UI/UX & Accessibility Quality | Super Admin Console',
  description: 'Master platform UI/UX audit console, design token consistency, responsive layout status, and WAI-ARIA accessibility scores.',
}

export default function SuperAdminUXPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminUXConsoleView />
    </AdminDashboardLayout>
  )
}
