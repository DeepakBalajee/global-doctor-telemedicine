import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { runFullUXAudit } from '@/lib/ux/ux-validator'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const summary = runFullUXAudit()
  return NextResponse.json(summary, { status: 200 })
}

export async function POST() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const summary = runFullUXAudit()
  return NextResponse.json(summary, { status: 200 })
}
