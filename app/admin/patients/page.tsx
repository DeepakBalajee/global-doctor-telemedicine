import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { PatientManagementPanel } from '@/components/admin/PatientManagementPanel'

export const metadata: Metadata = {
  title: 'Patient Account Administration | Admin Portal',
  description: 'Manage registered patient accounts and operational status with strict data privacy safeguards.',
}

export default function AdminPatientsPage() {
  return (
    <AdminDashboardLayout role="ADMIN">
      <PatientManagementPanel />
    </AdminDashboardLayout>
  )
}
