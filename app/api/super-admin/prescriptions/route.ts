import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/types/auth'
import { getPrescriptionsForUser } from '@/lib/medical-records/prescription-store'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const prescriptions = getPrescriptionsForUser('USR-SA-001', UserRole.SUPER_ADMIN)
  return NextResponse.json({ prescriptions }, { status: 200 })
}
