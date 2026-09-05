import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/types/auth'
import { getMedicalDocumentsForUser } from '@/lib/medical-records/document-store'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const documents = getMedicalDocumentsForUser('USR-SA-001', UserRole.SUPER_ADMIN)
  return NextResponse.json({ documents }, { status: 200 })
}
