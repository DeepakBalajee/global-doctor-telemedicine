import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSystemHealthStatus } from '@/lib/admin/security-store'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin session required.' }, { status: 403 })
  }

  const health = getSystemHealthStatus()
  return NextResponse.json(health, { status: 200 })
}
