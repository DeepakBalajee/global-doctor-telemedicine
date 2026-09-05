import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { runFullE2EQASuite } from '@/lib/testing/e2e-qa-runner'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const summary = await runFullE2EQASuite()
  return NextResponse.json(summary, { status: 200 })
}

export async function POST() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const summary = await runFullE2EQASuite()
  return NextResponse.json(summary, { status: 200 })
}
