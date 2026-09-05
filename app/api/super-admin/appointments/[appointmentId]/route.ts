import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getAppointmentDetailFromDB } from '@/lib/patient/patient-appointments-store'

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value || cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const { appointmentId } = params
  const appointment = await getAppointmentDetailFromDB(appointmentId)

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, appointment }, { status: 200 })
}
