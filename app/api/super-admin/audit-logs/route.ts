import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAuditLogs } from '@/lib/admin/audit-logger'

export async function GET() {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const logs = await getAuditLogs()
  return NextResponse.json(logs, { status: 200 })
}
