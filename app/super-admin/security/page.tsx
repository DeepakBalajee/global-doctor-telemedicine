import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminSecurityView } from '@/components/super-admin/SuperAdminSecurityView'

export const metadata: Metadata = {
  title: 'Security Hardening & Penetration Testing | Super Admin Console',
  description: 'Master platform cybersecurity console, vulnerability matrix, and penetration testing suite.',
}

export default function SuperAdminSecurityPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminSecurityView />
    </AdminDashboardLayout>
  )
}
