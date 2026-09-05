import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUnreadNotificationCount } from '@/lib/notifications/notification-store'

export async function GET() {
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

  const count = getUnreadNotificationCount(activeUserId)
  return NextResponse.json({ unreadCount: count }, { status: 200 })
}
