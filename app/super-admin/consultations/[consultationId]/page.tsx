import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminConsultationDetailView } from '@/components/super-admin/SuperAdminConsultationDetailView'
import { getAppointmentDetailFromDB } from '@/lib/patient/patient-appointments-store'

export const metadata: Metadata = {
  title: 'Consultation Session Detail | Super Admin Console',
  description: 'Operational inspection of consultation session record.',
}

export default async function SuperAdminConsultationDetailPage({
  params,
}: {
  params: { consultationId: string }
}) {
  const apptId = params.consultationId.replace('SES-', '')
  const appointment = await getAppointmentDetailFromDB(apptId)

  const consultation = appointment
    ? {
        id: params.consultationId,
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        specialtyName: appointment.specialtyName,
        consultationType: appointment.consultationType,
        status: appointment.appointmentStatus === ('COMPLETED' as any) ? 'COMPLETED' : 'ACTIVE',
        startedAt: appointment.createdAt,
        durationMinutes: 15,
        createdAt: appointment.createdAt,
      }
    : {
        id: params.consultationId,
        appointmentId: apptId,
        patientId: 'PAT-88190',
        patientName: 'Anita Sharma',
        doctorId: 'DOC-101',
        doctorName: 'Dr. Sarah Jenkins',
        specialtyName: 'Cardiology',
        consultationType: 'ONLINE_VIDEO',
        status: 'COMPLETED',
        startedAt: new Date().toISOString(),
        durationMinutes: 15,
        createdAt: new Date().toISOString(),
      }

  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminConsultationDetailView consultation={consultation} />
    </AdminDashboardLayout>
  )
}
