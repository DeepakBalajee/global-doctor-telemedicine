import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { DoctorVerificationPanel } from '@/components/admin/DoctorVerificationPanel'

export const metadata: Metadata = {
  title: 'Doctor Verification & Accounts | Admin Portal',
  description: 'Review pending doctor registration applications, verify credentials, and manage doctor accounts.',
}

export default function AdminDoctorsPage() {
  return (
    <AdminDashboardLayout role="ADMIN">
      <DoctorVerificationPanel />
    </AdminDashboardLayout>
  )
}
