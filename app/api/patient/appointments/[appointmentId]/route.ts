import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getAppointmentDetailFromDB } from '@/lib/patient/patient-appointments-store'

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_patient_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { appointmentId } = params
  const appointment = await getAppointmentDetailFromDB(appointmentId)

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 })
  }

  // Strict IDOR Protection: Verifies authenticated patient matches appointment ownership
  if (session.role === 'PATIENT' && appointment.patientId !== session.patientId) {
    return NextResponse.json({ error: 'Forbidden. You do not have permission to view this appointment.' }, { status: 403 })
  }

  return NextResponse.json(appointment, { status: 200 })
}
