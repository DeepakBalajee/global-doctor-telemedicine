import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminDoctorsPanel } from '@/components/super-admin/SuperAdminDoctorsPanel'

export const metadata: Metadata = {
  title: 'Doctor Profile & Medical History | Super Admin Console',
  description: 'Super Admin master inspection of doctor verification, consultations, and prescriptions.',
}

export default function SuperAdminDoctorDetailPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminDoctorsPanel />
    </AdminDashboardLayout>
  )
}
