import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { patientAppointmentsStore } from '@/lib/patient/patient-appointments-store'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const appointments = Array.from(patientAppointmentsStore.values())
  const consultations = appointments.map((a) => ({
    id: 'SES-' + a.id,
    appointmentId: a.id,
    patientId: a.patientId,
    patientName: a.patientName,
    doctorId: a.doctorId,
    doctorName: a.doctorName,
    specialtyName: a.specialtyName,
    consultationType: a.consultationType,
    status: a.appointmentStatus === ('COMPLETED' as any) ? 'COMPLETED' : 'ACTIVE',
    startedAt: a.createdAt,
    durationMinutes: 15,
    createdAt: a.createdAt,
  }))

  return NextResponse.json({ consultations }, { status: 200 })
}
