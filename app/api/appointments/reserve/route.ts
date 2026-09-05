import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { reserveSlotInDB } from '@/lib/patient/patient-appointments-store'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('telemed_patient_session')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const session = await validateDBSession(token)

    if (!session || session.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const body = await request.json()
    const { doctorId, date, startTime, consultationType, problem } = body

    if (!doctorId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Please select a valid doctor, date, and available time slot.' },
        { status: 400 }
      )
    }

    const res = await reserveSlotInDB({
      doctorId,
      date,
      startTime,
      consultationType,
      patientUserId: session.userId,
      problem,
    })

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 409 })
    }

    return NextResponse.json(
      {
        success: true,
        consultationRequestId: res.consultationRequestId,
        feeInINR: res.feeInINR,
        lockKey: `${doctorId}:${date}:${startTime}`,
        message: 'Slot temporarily reserved. Please complete ₹5 payment to confirm appointment.',
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Reserve slot endpoint error:', err)
    return NextResponse.json(
      { error: 'Unable to reserve slot. Please try again.' },
      { status: 500 }
    )
  }
}
