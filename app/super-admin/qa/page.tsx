import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminQAConsoleView } from '@/components/super-admin/SuperAdminQAConsoleView'

export const metadata: Metadata = {
  title: 'End-to-End QA & Testing | Super Admin Console',
  description: 'Master platform QA testing console, automated E2E regression test runner across all 13 core modules.',
}

export default function SuperAdminQAPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminQAConsoleView />
    </AdminDashboardLayout>
  )
}
