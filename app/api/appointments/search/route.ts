import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { searchAppointmentsInStore } from '@/lib/search/search-engine'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')
  const adminCookie = cookieStore.get('telemed_admin_session')
  const docCookie = cookieStore.get('telemed_doc_session')
  const patientCookie = cookieStore.get('telemed_patient_session')

  if (!superAdminCookie && !adminCookie && !docCookie && !patientCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || undefined
  const status = searchParams.get('status') || undefined

  const result = searchAppointmentsInStore({ query, status })
  return NextResponse.json(result, { status: 200 })
}
