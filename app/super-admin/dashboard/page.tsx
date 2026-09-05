import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminMasterDashboardView } from '@/components/super-admin/SuperAdminMasterDashboardView'

export const metadata: Metadata = {
  title: 'Master Control Center | Super Admin Console',
  description: 'Single Master Platform Authority over 14 Telemedicine Modules.',
}

export default function SuperAdminMasterDashboardPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminMasterDashboardView />
    </AdminDashboardLayout>
  )
}
