import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { startConsultationSession } from '@/lib/consultations/consultation-store'

export async function POST(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_doc_session')?.value ||
    cookieStore.get('telemed_patient_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { appointmentId } = params
  const result = await startConsultationSession(appointmentId, session.role)

  if (!result.session) {
    return NextResponse.json({ error: result.error || 'Failed to start session.' }, { status: 400 })
  }

  return NextResponse.json({ success: true, session: result.session }, { status: 200 })
}
