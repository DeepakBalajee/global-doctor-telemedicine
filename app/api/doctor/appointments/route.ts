import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getDoctorAppointmentsFromDB } from '@/lib/patient/patient-appointments-store'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_doc_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
  }

  const session = await validateDBSession(token)

  if (!session || session.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab') || 'upcoming'

  const result = await getDoctorAppointmentsFromDB(session.userId, tab)

  return NextResponse.json(result, { status: 200 })
}
