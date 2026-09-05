import { Metadata } from 'next'
import { PatientAppointmentsView } from '@/components/patient/appointments/PatientAppointmentsView'

export const metadata: Metadata = {
  title: 'My Appointments | Global Doctor Telemedicine Platform',
  description: 'View upcoming, past, and cancelled patient consultations and appointment details.',
}

export default function PatientAppointmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <PatientAppointmentsView />
    </div>
  )
}
