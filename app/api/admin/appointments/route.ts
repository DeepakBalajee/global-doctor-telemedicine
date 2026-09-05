import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { patientAppointmentsStore } from '@/lib/patient/patient-appointments-store'

export async function GET() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('telemed_admin_session')
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!adminCookie && !superAdminCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const list = Array.from(patientAppointmentsStore.values())
  return NextResponse.json(list, { status: 200 })
}
