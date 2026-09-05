import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorProfileView } from '@/components/doctor/dashboard/DoctorProfileView'

export const metadata: Metadata = {
  title: 'Doctor Profile | Global Doctor Telemedicine Platform',
  description: 'View and manage your verified doctor profile, credentials, and practice location.',
}

export default function DoctorProfilePage() {
  return (
    <DoctorDashboardLayout>
      <DoctorProfileView />
    </DoctorDashboardLayout>
  )
}
