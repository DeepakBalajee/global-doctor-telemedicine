import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorAppointmentsView } from '@/components/doctor/appointments/DoctorAppointmentsView'

export const metadata: Metadata = {
  title: 'Doctor Appointments Workstation | Global Doctor Telemedicine Platform',
  description: 'Manage patient consultation sessions, today schedule, and clinical appointments.',
}

export default function DoctorAppointmentsPage() {
  return (
    <DoctorDashboardLayout>
      <DoctorAppointmentsView />
    </DoctorDashboardLayout>
  )
}
