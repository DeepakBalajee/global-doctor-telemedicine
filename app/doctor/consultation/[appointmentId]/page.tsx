import { Metadata } from 'next'
import { UserRole } from '@/types/auth'
import { ConsultationRoomView } from '@/components/consultations/ConsultationRoomView'

export const metadata: Metadata = {
  title: 'Telemedicine Video Consultation | Doctor Workstation',
  description: 'Secure doctor-patient consultation room workstation.',
}

export default function DoctorConsultationPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <ConsultationRoomView
        appointmentId={params.appointmentId}
        activeUserId="DOC-101"
        activeUserRole={UserRole.DOCTOR}
        returnUrl="/doctor/appointments"
      />
    </div>
  )
}
