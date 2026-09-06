import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { doctorId } = params
  const body = await request.json().catch(() => ({}))
  const reason = body.reason || 'Credentials incomplete'

  try {
    const res = await db.query(
      `
      UPDATE doctors
      SET verification_status = 'REJECTED',
          account_status = 'REJECTED',
          updated_at = NOW()
      WHERE id = $1 OR user_id = $1
      `,
      [doctorId]
    )

    await db.query(
      `
      UPDATE users
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 OR id = (SELECT user_id FROM doctors WHERE id = $1)
      `,
      [doctorId]
    )

    if ((res.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Doctor record not found.' }, { status: 404 })
    }

    logAuditEvent({
      actorUserId: 'ADMIN',
      actorRole: 'SUPER_ADMIN' as any,
      action: 'DOCTOR_REJECTED',
      targetType: 'DOCTOR',
      targetId: doctorId,
      details: `Doctor ${doctorId} verification rejected: ${reason}`,
      success: true,
    })

    return NextResponse.json(
      { success: true, message: `Doctor ${doctorId} verification rejected.` },
      { status: 200 }
    )
  } catch (err) {
    console.error('Reject doctor error:', err)
    return NextResponse.json({ error: 'Failed to reject doctor verification.' }, { status: 500 })
  }
}
