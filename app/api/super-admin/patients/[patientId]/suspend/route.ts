import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { patientId } = params

  try {
    const res = await db.query(
      `
      UPDATE users
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 OR id = (SELECT user_id FROM patients WHERE id = $1)
      `,
      [patientId]
    )

    if ((res.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Patient record not found.' }, { status: 404 })
    }

    logAuditEvent({
      actorUserId: 'USR-SA-001',
      actorRole: 'SUPER_ADMIN' as any,
      action: 'PATIENT_SUSPENDED',
      targetType: 'PATIENT',
      targetId: patientId,
      details: `Patient ${patientId} account suspended by Super Admin.`,
      success: true,
    })

    return NextResponse.json(
      { success: true, message: `Patient ${patientId} account suspended.` },
      { status: 200 }
    )
  } catch (err) {
    console.error('Suspend patient error:', err)
    return NextResponse.json({ error: 'Failed to suspend patient.' }, { status: 500 })
  }
}
