import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { createDBSession } from '@/lib/auth/session'
import { ensureDatabaseSeeded } from '@/lib/db/seed-db'
import { UserRole } from '@/types/auth'

export async function POST(request: Request) {
  await ensureDatabaseSeeded()

  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body

    if (!usernameOrEmail?.trim() || !password) {
      return NextResponse.json(
        { success: false, message: 'Invalid username/email or password.' },
        { status: 400 }
      )
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase()

    // 1. Query users table for matching user
    const userRes = await db.query(
      `
      SELECT id, username, email, password_hash, role, is_active
      FROM users
      WHERE LOWER(username) = $1 OR LOWER(email) = $1
      LIMIT 1
      `,
      [cleanInput]
    )

    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid username/email or password.' },
        { status: 401 }
      )
    }

    const user = userRes.rows[0]

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: 'Account is suspended or inactive.' },
        { status: 403 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid username/email or password.' },
        { status: 401 }
      )
    }

    // Determine role & redirect URL
    let role = user.role as UserRole
    let redirectUrl = '/patient/dashboard'

    if (role === UserRole.SUPER_ADMIN) {
      redirectUrl = '/super-admin/dashboard'
    } else if (role === UserRole.DOCTOR) {
      redirectUrl = '/doctor/dashboard'
    } else if (role === UserRole.ADMIN) {
      redirectUrl = '/admin/dashboard'
    }

    // Create session in database
    const sessionToken = await createDBSession(user.id, role, 7)

    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id])

    const cookieName =
      role === UserRole.SUPER_ADMIN
        ? 'telemed_superadmin_session'
        : role === UserRole.DOCTOR
        ? 'telemed_doctor_session'
        : 'telemed_patient_session'

    const response = NextResponse.json(
      {
        success: true,
        redirectUrl,
        message: 'Authentication successful.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    )

    response.cookies.set({
      name: cookieName,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('UNIFIED LOGIN ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Unable to connect to the server. Please try again.' },
      { status: 500 }
    )
  }
}
