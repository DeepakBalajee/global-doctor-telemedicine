import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminHandoverView } from '@/components/super-admin/SuperAdminHandoverView'

export const metadata: Metadata = {
  title: 'Production Handover & Deployment | Super Admin Console',
  description: 'Master platform handover console, 20-vector deployment audit grid, and release candidate v1.0.0-RC-PROD verification.',
}

export default function SuperAdminHandoverPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminHandoverView />
    </AdminDashboardLayout>
  )
}
