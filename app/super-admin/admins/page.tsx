import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminAdminsPanel } from '@/components/admin/SuperAdminAdminsPanel'

export const metadata: Metadata = {
  title: 'Admin Members & Audit Logs | Super Admin Console',
  description: 'Manage authorized Admin head members, suspend access, and inspect security audit logs.',
}

export default function SuperAdminAdminsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Console">
      <SuperAdminAdminsPanel />
    </AdminDashboardLayout>
  )
}
