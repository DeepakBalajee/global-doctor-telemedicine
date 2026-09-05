import { Metadata } from 'next'
import { AppointmentDetailsView } from '@/components/patient/appointments/AppointmentDetailsView'

export const metadata: Metadata = {
  title: 'Appointment Details | Global Doctor Telemedicine Platform',
  description: 'View specific consultation details, timeline status, and receipt breakdown.',
}

export default function PatientAppointmentDetailPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <AppointmentDetailsView appointmentId={params.appointmentId} />
    </div>
  )
}
