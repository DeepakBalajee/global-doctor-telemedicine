import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import {
  getConsultationSessionByAppointmentId,
  getConsultationMessages,
  sendConsultationMessage,
} from '@/lib/consultations/consultation-store'

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_doc_session')?.value ||
    cookieStore.get('telemed_patient_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value ||
    cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { appointmentId } = params
  const consultationSession = await getConsultationSessionByAppointmentId(appointmentId)

  if (!consultationSession) {
    return NextResponse.json({ error: 'Consultation session not found.' }, { status: 404 })
  }

  const messages = await getConsultationMessages(consultationSession.id)

  return NextResponse.json({ messages }, { status: 200 })
}

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

  try {
    const body = await request.json()
    const { appointmentId } = params

    if (!body.message?.trim()) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 })
    }

    const consultationSession = await getConsultationSessionByAppointmentId(appointmentId)

    if (!consultationSession) {
      return NextResponse.json({ error: 'Consultation session not found.' }, { status: 404 })
    }

    const result = await sendConsultationMessage({
      sessionId: consultationSession.id,
      senderUserId: session.userId,
      senderName: session.name,
      senderRole: session.role,
      message: body.message.trim(),
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send message.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: result.messageItem }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }
}
