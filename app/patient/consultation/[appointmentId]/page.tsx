import { Metadata } from 'next'
import { UserRole } from '@/types/auth'
import { ConsultationRoomView } from '@/components/consultations/ConsultationRoomView'

export const metadata: Metadata = {
  title: 'Telemedicine Video Consultation | Patient Portal',
  description: 'Secure doctor-patient consultation room.',
}

export default function PatientConsultationPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <ConsultationRoomView
        appointmentId={params.appointmentId}
        activeUserId="PAT-88190"
        activeUserRole={UserRole.PATIENT}
        returnUrl="/patient/appointments"
      />
    </div>
  )
}
