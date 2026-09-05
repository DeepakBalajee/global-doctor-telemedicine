import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminMedicalRecordsPanel } from '@/components/super-admin/SuperAdminMedicalRecordsPanel'

export const metadata: Metadata = {
  title: 'Master Medical Records Oversight | Super Admin Console',
  description: 'Platform-wide oversight of digital prescriptions and medical records.',
}

export default function SuperAdminMedicalRecordsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminMedicalRecordsPanel />
    </AdminDashboardLayout>
  )
}
