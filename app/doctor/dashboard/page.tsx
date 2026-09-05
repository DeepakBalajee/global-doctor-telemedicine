import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorDashboardView } from '@/components/doctor/dashboard/DoctorDashboardView'

export const metadata: Metadata = {
  title: 'Doctor Dashboard | Global Doctor Telemedicine Platform',
  description: 'Authenticated Doctor Workstation Dashboard - Clinical overview, appointments, and consultation management.',
}

export default function DoctorDashboardPage() {
  return (
    <DoctorDashboardLayout>
      <DoctorDashboardView />
    </DoctorDashboardLayout>
  )
}
