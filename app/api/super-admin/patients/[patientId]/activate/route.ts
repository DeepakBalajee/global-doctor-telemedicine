import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuditEvent } from '@/lib/admin/audit-logger'

export async function PATCH(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { patientId } = params

  logAuditEvent({
    actorUserId: 'USR-SA-001',
    actorRole: 'SUPER_ADMIN' as any,
    action: 'PATIENT_ACTIVATED',
    targetType: 'PATIENT',
    targetId: patientId,
    details: `Patient ${patientId} account reactivated by Super Admin.`,
    success: true,
  })

  return NextResponse.json(
    { success: true, message: `Patient ${patientId} account reactivated.` },
    { status: 200 }
  )
}
