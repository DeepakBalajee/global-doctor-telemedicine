import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/types/auth'
import { getDoctorAnalytics } from '@/lib/analytics/analytics-store'

export async function GET() {
  const cookieStore = cookies()
  const docCookie = cookieStore.get('telemed_doc_session')

  if (!docCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const doctorId = 'DOC-101'
  const data = getDoctorAnalytics(doctorId, 'USR-DOC-101', UserRole.DOCTOR)

  if (!data) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
  }

  return NextResponse.json(data, { status: 200 })
}
