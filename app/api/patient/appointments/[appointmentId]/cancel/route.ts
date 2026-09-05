import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { cancelAppointmentInDB, getAppointmentDetailFromDB } from '@/lib/patient/patient-appointments-store'

export async function POST(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_patient_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)

  if (!session || session.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { appointmentId } = params
  const appointment = await getAppointmentDetailFromDB(appointmentId)

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 })
  }

  // Strict IDOR Ownership Check
  if (appointment.patientId !== session.patientId) {
    return NextResponse.json(
      { error: 'Forbidden. You do not have permission to cancel this appointment.' },
      { status: 403 }
    )
  }

  if (appointment.appointmentStatus === ('COMPLETED' as any)) {
    return NextResponse.json(
      { error: 'Invalid operation. Completed consultations cannot be cancelled.' },
      { status: 400 }
    )
  }

  if (appointment.appointmentStatus === ('CANCELLED' as any)) {
    return NextResponse.json(
      { error: 'This appointment has already been cancelled.' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const reason = body.reason || 'Cancelled by patient request'

    const res = await cancelAppointmentInDB(appointmentId, 'PATIENT', reason)

    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 400 })
    }

    const updated = await getAppointmentDetailFromDB(appointmentId)

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment cancelled successfully. Reserved slot has been released back to availability.',
        appointment: updated,
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to process cancellation.' }, { status: 500 })
  }
}
