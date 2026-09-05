import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminGlobalSearchOverlay } from '@/components/search/SuperAdminGlobalSearchOverlay'

export const metadata: Metadata = {
  title: 'Global Master Search | Super Admin Console',
  description: 'Multi-entity search across doctors, patients, appointments, and financial ledgers.',
}

export default function SuperAdminSearchPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminGlobalSearchOverlay />
    </AdminDashboardLayout>
  )
}
