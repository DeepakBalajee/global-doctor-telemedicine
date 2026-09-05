import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuditLogs } from '@/lib/admin/audit-logger'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const logs = getAuditLogs()
  return NextResponse.json(logs, { status: 200 })
}
