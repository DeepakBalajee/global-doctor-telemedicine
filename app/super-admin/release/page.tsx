import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminReleaseView } from '@/components/super-admin/SuperAdminReleaseView'

export const metadata: Metadata = {
  title: 'Production Readiness & Release Candidate | Super Admin Console',
  description: 'Master platform release candidate auditor, 22-subsystem verification grid, and production deployment checklist.',
}

export default function SuperAdminReleasePage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminReleaseView />
    </AdminDashboardLayout>
  )
}
