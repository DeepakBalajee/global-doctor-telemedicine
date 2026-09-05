import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { markNotificationAsRead } from '@/lib/notifications/notification-store'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')
  const adminCookie = cookieStore.get('telemed_admin_session')
  const docCookie = cookieStore.get('telemed_doc_session')
  const patientCookie = cookieStore.get('telemed_patient_session')

  let activeUserId = 'USR-GUEST'
  if (superAdminCookie) activeUserId = 'USR-SA-001'
  else if (adminCookie) activeUserId = 'USR-ADM-001'
  else if (docCookie) activeUserId = 'USR-DOC-101'
  else if (patientCookie) activeUserId = 'USR-PAT-88190'

  const success = markNotificationAsRead(params.id, activeUserId)
  if (!success) {
    return NextResponse.json({ error: 'Notification not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
