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

  try {
    const res = await db.query(
      `
      UPDATE doctors
      SET account_status = 'ACTIVE',
          updated_at = NOW()
      WHERE id = $1 OR user_id = $1
      `,
      [doctorId]
    )

    await db.query(
      `
      UPDATE users
      SET is_active = true, updated_at = NOW()
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
      action: 'DOCTOR_REACTIVATED',
      targetType: 'DOCTOR',
      targetId: doctorId,
      details: `Doctor ${doctorId} account reactivated.`,
      success: true,
    })

    return NextResponse.json(
      { success: true, message: `Doctor ${doctorId} account reactivated.` },
      { status: 200 }
    )
  } catch (err) {
    console.error('Activate doctor error:', err)
    return NextResponse.json({ error: 'Failed to reactivate doctor account.' }, { status: 500 })
  }
}
