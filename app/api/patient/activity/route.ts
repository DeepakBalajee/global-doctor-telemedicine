import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/types/auth'
import { getPatientActivity } from '@/lib/analytics/analytics-store'

export async function GET() {
  const cookieStore = cookies()
  const patientCookie = cookieStore.get('telemed_patient_session')

  if (!patientCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const patientId = 'PAT-88190'
  const data = getPatientActivity(patientId, 'USR-PAT-88190', UserRole.PATIENT)

  if (!data) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
  }

  return NextResponse.json(data, { status: 200 })
}
