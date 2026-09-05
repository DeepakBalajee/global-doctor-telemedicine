import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminDoctorsPanel } from '@/components/super-admin/SuperAdminDoctorsPanel'

export const metadata: Metadata = {
  title: 'Master Doctor Oversight | Super Admin Console',
  description: 'Platform-wide doctor oversight, verification reviews, and account controls.',
}

export default function SuperAdminDoctorsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminDoctorsPanel />
    </AdminDashboardLayout>
  )
}
