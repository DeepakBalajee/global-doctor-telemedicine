import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyPassword, hashPassword } from '@/lib/auth/password'
import { validateDBSession } from '@/lib/auth/session'
import { logAuditEvent } from '@/lib/admin/audit-logger'

export async function PATCH(request: Request) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin session required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { currentPassword, newUsername, newEmail, newPassword } = body

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required to update credentials.' }, { status: 400 })
    }

    // 1. Verify current password against PostgreSQL
    const userRes = await db.query(
      `SELECT id, username, password_hash FROM users WHERE id = $1 AND role = 'SUPER_ADMIN' LIMIT 1`,
      [session.userId]
    )

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'Super Admin account not found.' }, { status: 404 })
    }

    const saUser = userRes.rows[0]
    const isValid = await verifyPassword(currentPassword, saUser.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect current password.' }, { status: 401 })
    }

    // 2. Validate new username uniqueness if changing
    const cleanUsername = newUsername?.trim()?.toLowerCase()
    if (cleanUsername && cleanUsername !== saUser.username.toLowerCase()) {
      const unameCheck = await db.query(`SELECT id FROM users WHERE LOWER(username) = $1 AND id != $2`, [
        cleanUsername,
        session.userId,
      ])

      if (unameCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Username is already taken by another account.' }, { status: 400 })
      }
    }

    // 3. Update fields
    const finalUsername = cleanUsername || saUser.username
    let finalPasswordHash = saUser.password_hash

    if (newPassword && newPassword.length >= 6) {
      finalPasswordHash = await hashPassword(newPassword)
    }

    await db.query(
      `
      UPDATE users
      SET username = $1,
          email = COALESCE($2, email),
          password_hash = $3,
          updated_at = NOW()
      WHERE id = $4
      `,
      [finalUsername, newEmail?.trim() || null, finalPasswordHash, session.userId]
    )

    await db.query(
      `
      UPDATE admin_accounts
      SET username = $1,
          email = COALESCE($2, email)
      WHERE user_id = $3
      `,
      [finalUsername, newEmail?.trim() || null, session.userId]
    )

    logAuditEvent({
      actorUserId: session.userId,
      actorRole: 'SUPER_ADMIN' as any,
      action: 'SUPER_ADMIN_CREDENTIALS_UPDATED',
      targetType: 'SUPER_ADMIN',
      targetId: session.userId,
      details: `Super Admin username/password updated. New username: ${finalUsername}`,
      success: true,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Super Admin credentials updated successfully.',
        newUsername: finalUsername,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Update Super Admin credentials error:', err)
    return NextResponse.json({ error: 'Failed to update credentials. Please try again.' }, { status: 500 })
  }
}
