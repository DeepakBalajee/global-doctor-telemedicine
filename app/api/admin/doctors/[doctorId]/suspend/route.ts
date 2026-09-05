import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_admin_session')?.value || cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { doctorId } = params

  try {
    const res = await db.query(
      `
      UPDATE doctors
      SET account_status = 'SUSPENDED',
          updated_at = NOW()
      WHERE id = $1 OR user_id = $1
      `,
      [doctorId]
    )

    if ((res.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: 'Doctor record not found.' }, { status: 404 })
    }

    logAuditEvent({
      actorUserId: session.userId,
      actorRole: session.role,
      action: 'DOCTOR_SUSPENDED',
      targetType: 'DOCTOR',
      targetId: doctorId,
      details: `Doctor ${doctorId} account suspended by admin.`,
      success: true,
    })

    return NextResponse.json(
      { success: true, message: `Doctor ${doctorId} account suspended.` },
      { status: 200 }
    )
  } catch (err) {
    console.error('Suspend doctor error:', err)
    return NextResponse.json({ error: 'Failed to suspend doctor account.' }, { status: 500 })
  }
}
