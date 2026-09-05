import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { AdminPatientSearchPanel } from '@/components/search/AdminPatientSearchPanel'

export const metadata: Metadata = {
  title: 'Patient Directory Search | Admin Workstation',
  description: 'Search patient directory with data minimization controls.',
}

export default function AdminSearchPage() {
  return (
    <AdminDashboardLayout role="ADMIN" adminName="Admin Head Console">
      <AdminPatientSearchPanel />
    </AdminDashboardLayout>
  )
}
