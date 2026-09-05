import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSecurityEvents } from '@/lib/admin/security-store'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin session required.' }, { status: 403 })
  }

  const events = getSecurityEvents()
  return NextResponse.json(events, { status: 200 })
}
