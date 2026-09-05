import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm'

export const metadata: Metadata = {
  title: 'Issue Prescription | Doctor Workstation',
  description: 'Clinical digital prescription writer.',
}

export default function IssuePrescriptionPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  return (
    <DoctorDashboardLayout>
      <PrescriptionForm
        appointmentId={params.appointmentId}
        patientId="PAT-88190"
        patientName="Anita Sharma"
        doctorId="DOC-101"
        doctorName="Dr. Sarah Jenkins"
        doctorSpecialty="Cardiology"
      />
    </DoctorDashboardLayout>
  )
}
