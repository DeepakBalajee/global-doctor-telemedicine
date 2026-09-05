import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { patientAppointmentsStore } from '@/lib/patient/patient-appointments-store'

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { appointmentId } = params
  const appointment = patientAppointmentsStore.get(appointmentId)

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 })
  }

  // Strict Doctor IDOR Protection: Verifies authenticated doctor owns this appointment
  if (appointment.doctorId !== 'DOC-101') {
    return NextResponse.json(
      { error: 'Forbidden. You are not authorized to view this appointment.' },
      { status: 403 }
    )
  }

  return NextResponse.json(appointment, { status: 200 })
}

export async function PATCH(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { appointmentId } = params
  const appointment = patientAppointmentsStore.get(appointmentId)

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 })
  }

  // Strict Doctor IDOR Ownership Check
  if (appointment.doctorId !== 'DOC-101') {
    return NextResponse.json(
      { error: 'Forbidden. You are not authorized to manage this appointment.' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { action, reason } = body // action: 'confirm' | 'complete' | 'cancel'

    if (action === 'confirm') {
      if (appointment.appointmentStatus === ('CANCELLED' as any) || appointment.appointmentStatus === ('COMPLETED' as any)) {
        return NextResponse.json(
          { error: 'Cannot confirm a cancelled or completed appointment.' },
          { status: 400 }
        )
      }
      appointment.appointmentStatus = 'CONFIRMED' as any
      appointment.timeline.push({
        label: 'Appointment Confirmed by Doctor',
        status: 'COMPLETED',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      })
    } else if (action === 'complete') {
      if (appointment.appointmentStatus === ('CANCELLED' as any)) {
        return NextResponse.json(
          { error: 'Cannot complete a cancelled appointment.' },
          { status: 400 }
        )
      }
      appointment.appointmentStatus = 'COMPLETED' as any
      appointment.isCancellable = false
      appointment.timeline.push({
        label: 'Consultation Session Completed',
        status: 'COMPLETED',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      })
    } else if (action === 'cancel') {
      if (appointment.appointmentStatus === ('COMPLETED' as any)) {
        return NextResponse.json(
          { error: 'Cannot cancel an already completed consultation.' },
          { status: 400 }
        )
      }
      appointment.appointmentStatus = 'CANCELLED' as any
      appointment.cancellationReason = reason || 'Cancelled by doctor'
      appointment.cancelledBy = 'DOCTOR'
      appointment.isCancellable = false
      appointment.timeline.push({
        label: 'Appointment Cancelled by Doctor',
        status: 'CANCELLED',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      })
    } else {
      return NextResponse.json({ error: 'Invalid status action.' }, { status: 400 })
    }

    patientAppointmentsStore.set(appointmentId, appointment)

    return NextResponse.json(
      {
        success: true,
        message: `Appointment status updated to ${appointment.appointmentStatus}.`,
        appointment,
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update appointment.' }, { status: 500 })
  }
}
