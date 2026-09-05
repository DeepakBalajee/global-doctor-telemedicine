import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminMedicalRecordsPanel } from '@/components/super-admin/SuperAdminMedicalRecordsPanel'

export const metadata: Metadata = {
  title: 'Medical Record Detail | Super Admin Console',
  description: 'Master inspection of medical record history.',
}

export default function SuperAdminMedicalRecordDetailPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminMedicalRecordsPanel />
    </AdminDashboardLayout>
  )
}
