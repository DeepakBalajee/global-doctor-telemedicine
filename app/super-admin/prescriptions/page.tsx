import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminMedicalRecordsPanel } from '@/components/super-admin/SuperAdminMedicalRecordsPanel'

export const metadata: Metadata = {
  title: 'Master Prescriptions Directory | Super Admin Console',
  description: 'Platform-wide oversight of digital prescriptions.',
}

export default function SuperAdminPrescriptionsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminMedicalRecordsPanel />
    </AdminDashboardLayout>
  )
}
