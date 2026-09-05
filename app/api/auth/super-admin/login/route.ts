import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { createDBSession } from '@/lib/auth/session'
import { ensureDatabaseSeeded } from '@/lib/db/seed-db'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { UserRole } from '@/types/auth'

export async function POST(request: Request) {
  await ensureDatabaseSeeded()

  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body

    if (!usernameOrEmail?.trim() || !password) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 400 })
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase()

    const userRes = await db.query(
      `
      SELECT 
        u.id AS user_id,
        u.username,
        u.email,
        u.password_hash,
        u.role AS user_role,
        u.name,
        u.is_active,
        a.id AS admin_id,
        a.account_status,
        a.role AS admin_role
      FROM users u
      JOIN admin_accounts a ON a.user_id = u.id
      WHERE (LOWER(u.username) = $1 OR LOWER(u.email) = $1)
        AND u.role = 'SUPER_ADMIN'
      LIMIT 1
      `,
      [cleanInput]
    )

    if (userRes.rows.length === 0) {
      logAuditEvent({
        actorUserId: 'ANONYMOUS',
        actorRole: UserRole.PATIENT,
        action: 'FAILED_SUPER_ADMIN_LOGIN_ATTEMPT',
        details: `Non-Super-Admin user attempted Super Admin login: ${usernameOrEmail}`,
        success: false,
      })
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 })
    }

    const row = userRes.rows[0]

    const isValidPassword = await verifyPassword(password, row.password_hash)

    if (!isValidPassword) {
      logAuditEvent({
        actorUserId: row.user_id,
        actorRole: UserRole.SUPER_ADMIN,
        action: 'FAILED_SUPER_ADMIN_LOGIN_ATTEMPT',
        details: `Failed password verification for Super Admin: ${row.username}`,
        success: false,
      })
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 })
    }

    if (row.account_status === 'SUSPENDED' || !row.is_active) {
      return NextResponse.json({ message: 'Account is suspended.' }, { status: 403 })
    }

    // Create real PostgreSQL session token
    const sessionToken = await createDBSession(row.user_id, UserRole.SUPER_ADMIN, 0.5) // 12 hours

    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.user_id])
    await db.query('UPDATE admin_accounts SET last_login_at = NOW() WHERE id = $1', [row.admin_id])

    logAuditEvent({
      actorUserId: row.user_id,
      actorRole: UserRole.SUPER_ADMIN,
      action: 'SUPER_ADMIN_LOGIN',
      details: 'Super Admin logged in successfully.',
      success: true,
    })

    const response = NextResponse.json(
      {
        status: 'SUCCESS',
        message: 'Super Admin authentication successful.',
        user: {
          id: row.admin_id,
          userId: row.user_id,
          role: UserRole.SUPER_ADMIN,
          name: row.name,
          email: row.email,
        },
      },
      { status: 200 }
    )

    response.cookies.set({
      name: 'telemed_super_admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 43200,
    })

    return response
  } catch (err) {
    console.error('SUPER ADMIN LOGIN ERROR:', err)
    return NextResponse.json({ message: 'Unable to connect to the server. Please try again.' }, { status: 500 })
  }
}
