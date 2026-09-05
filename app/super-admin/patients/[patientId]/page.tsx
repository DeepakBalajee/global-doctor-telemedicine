import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminPatientsPanel } from '@/components/super-admin/SuperAdminPatientsPanel'

export const metadata: Metadata = {
  title: 'Patient Profile & Medical History | Super Admin Console',
  description: 'Super Admin master inspection of patient account, appointments, and medical history.',
}

export default function SuperAdminPatientDetailPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminPatientsPanel />
    </AdminDashboardLayout>
  )
}
