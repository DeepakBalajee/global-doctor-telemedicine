import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getPatientAppointmentsFromDB } from '@/lib/patient/patient-appointments-store'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const list = await getPatientAppointmentsFromDB('ALL', 'all')
  return NextResponse.json(list, { status: 200 })
}
