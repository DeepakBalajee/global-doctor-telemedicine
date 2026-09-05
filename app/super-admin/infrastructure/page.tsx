import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminInfrastructureView } from '@/components/super-admin/SuperAdminInfrastructureView'

export const metadata: Metadata = {
  title: 'Production Infrastructure & Deployment | Super Admin Console',
  description: 'Master platform infrastructure readiness, liveness/readiness probes, and environment configuration.',
}

export default function SuperAdminInfrastructurePage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminInfrastructureView />
    </AdminDashboardLayout>
  )
}
