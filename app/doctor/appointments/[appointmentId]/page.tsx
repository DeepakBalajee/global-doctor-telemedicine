import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorAppointmentDetailsView } from '@/components/doctor/appointments/DoctorAppointmentDetailsView'

export const metadata: Metadata = {
  title: 'Doctor Appointment Detail | Global Doctor Telemedicine Platform',
  description: 'View patient consultation details, health problem summary, and session actions.',
}

export default function DoctorAppointmentDetailPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  return (
    <DoctorDashboardLayout>
      <DoctorAppointmentDetailsView appointmentId={params.appointmentId} />
    </DoctorDashboardLayout>
  )
}
