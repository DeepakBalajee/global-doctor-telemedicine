import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminMedicalRecordsPanel } from '@/components/super-admin/SuperAdminMedicalRecordsPanel'

export const metadata: Metadata = {
  title: 'Prescription Detail | Super Admin Console',
  description: 'Master inspection of digital prescription history.',
}

export default function SuperAdminPrescriptionDetailPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminMedicalRecordsPanel />
    </AdminDashboardLayout>
  )
}
