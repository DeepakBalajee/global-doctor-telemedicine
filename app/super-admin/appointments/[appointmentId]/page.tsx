import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { SuperAdminAppointmentDetailView } from '@/components/super-admin/SuperAdminAppointmentDetailView'
import { getAppointmentDetailFromDB } from '@/lib/patient/patient-appointments-store'

export const metadata: Metadata = {
  title: 'Appointment Inspection | Super Admin Console',
  description: 'Super Admin master inspection of appointment details and audit history.',
}

export default async function SuperAdminAppointmentDetailPage({
  params,
}: {
  params: { appointmentId: string }
}) {
  const appointment = await getAppointmentDetailFromDB(params.appointmentId)

  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <SuperAdminAppointmentDetailView appointment={appointment || undefined} />
    </AdminDashboardLayout>
  )
}
