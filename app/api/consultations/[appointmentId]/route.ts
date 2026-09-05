import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getOrCreateConsultationSession } from '@/lib/consultations/consultation-store'

export async function GET(
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
  const consultationSession = await getOrCreateConsultationSession(appointmentId, session.userId)

  if (!consultationSession) {
    return NextResponse.json({ error: 'Consultation session not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, session: consultationSession }, { status: 200 })
}
