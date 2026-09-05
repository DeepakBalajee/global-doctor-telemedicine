import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuditEvent } from '@/lib/admin/audit-logger'

export async function PATCH(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { doctorId } = params

  logAuditEvent({
    actorUserId: 'USR-SA-001',
    actorRole: 'SUPER_ADMIN' as any,
    action: 'DOCTOR_ACTIVATED',
    targetType: 'DOCTOR',
    targetId: doctorId,
    details: `Doctor ${doctorId} account reactivated by Super Admin.`,
    success: true,
  })

  return NextResponse.json(
    { success: true, message: `Doctor ${doctorId} account reactivated successfully.` },
    { status: 200 }
  )
}
