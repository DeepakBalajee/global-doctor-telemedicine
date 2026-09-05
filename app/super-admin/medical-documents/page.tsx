import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminMedicalRecordsPanel } from '@/components/super-admin/SuperAdminMedicalRecordsPanel'

export const metadata: Metadata = {
  title: 'Master Medical Documents Directory | Super Admin Console',
  description: 'Platform-wide oversight of uploaded medical documents and lab reports.',
}

export default function SuperAdminDocumentsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminMedicalRecordsPanel />
    </AdminDashboardLayout>
  )
}
