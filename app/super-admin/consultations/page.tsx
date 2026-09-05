import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminConsultationsPanel } from '@/components/super-admin/SuperAdminConsultationsPanel'

export const metadata: Metadata = {
  title: 'Consultations Directory | Super Admin Console',
  description: 'Master platform oversight of consultation sessions.',
}

export default function SuperAdminConsultationsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminConsultationsPanel />
    </AdminDashboardLayout>
  )
}
