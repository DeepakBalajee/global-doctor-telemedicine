import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { AdminDashboardView } from '@/components/admin/AdminDashboardView'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Global Doctor Telemedicine Platform',
  description: 'Platform administrative control panel and operational overview.',
}

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout role="ADMIN">
      <AdminDashboardView isSuperAdmin={false} />
    </AdminDashboardLayout>
  )
}
