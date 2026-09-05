import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getTypingStatus, setTypingStatus } from '@/lib/consultations/consultation-store'

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const docCookie = cookieStore.get('telemed_doc_session')
  const patientCookie = cookieStore.get('telemed_patient_session')

  let activeUserId = 'USR-PAT-88190'
  if (docCookie) activeUserId = 'USR-DOC-101'

  const typing = getTypingStatus(params.appointmentId, activeUserId)
  if (!typing) {
    return NextResponse.json({ isTyping: false }, { status: 200 })
  }

  return NextResponse.json({ isTyping: true, userName: typing.userName }, { status: 200 })
}

export async function POST(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const cookieStore = cookies()
  const docCookie = cookieStore.get('telemed_doc_session')
  const patientCookie = cookieStore.get('telemed_patient_session')

  let activeUserId = 'USR-PAT-88190'
  let userName = 'Anita Sharma'
  if (docCookie) {
    activeUserId = 'USR-DOC-101'
    userName = 'Dr. Sarah Jenkins'
  }

  const { isTyping } = await request.json()
  const status = setTypingStatus(params.appointmentId, activeUserId, userName, Boolean(isTyping))

  return NextResponse.json(status, { status: 200 })
}
