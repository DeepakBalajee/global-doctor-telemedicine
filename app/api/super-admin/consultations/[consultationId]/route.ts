import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { patientAppointmentsStore } from '@/lib/patient/patient-appointments-store'

export async function GET(
  request: Request,
  { params }: { params: { consultationId: string } }
) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const { consultationId } = params
  const apptId = consultationId.replace('SES-', '')
  const appointment = patientAppointmentsStore.get(apptId) || Array.from(patientAppointmentsStore.values())[0]

  if (!appointment) {
    return NextResponse.json({ error: 'Consultation session not found.' }, { status: 404 })
  }

  const consultation = {
    id: consultationId,
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

  return NextResponse.json({ success: true, consultation }, { status: 200 })
}
