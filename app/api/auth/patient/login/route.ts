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
    const { usernameOrEmail, password, isOtpLogin, mobileNumber, otpCode } = body

    let user: any = null

    if (isOtpLogin) {
      if (!mobileNumber?.trim() || !otpCode?.trim()) {
        return NextResponse.json(
          { success: false, message: 'Please enter both mobile number and 6-digit OTP code.' },
          { status: 400 }
        )
      }

      // Verify OTP against PostgreSQL
      const verifyRes = await fetch(`${new URL(request.url).origin}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otpCode, role: 'PATIENT' }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) {
        return NextResponse.json(
          { success: false, message: verifyData.error || verifyData.message || 'Invalid or expired OTP code.' },
          { status: 401 }
        )
      }

      const cleanMobile = mobileNumber.trim().replace(/\s+/g, '')
      const userRes = await db.query(
        `
        SELECT u.id, u.username, u.email, u.password_hash, u.role, u.is_active, p.id AS patient_id
        FROM users u
        JOIN patients p ON p.user_id = u.id
        WHERE REPLACE(p.mobile_number, ' ', '') LIKE $1
          AND u.role = 'PATIENT'
        LIMIT 1
        `,
        [`%${cleanMobile}%`]
      )

      if (userRes.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No patient account registered with this phone number.' },
          { status: 404 }
        )
      }

      user = userRes.rows[0]
    } else {
      if (!usernameOrEmail?.trim() || !password) {
        return NextResponse.json(
          { success: false, message: 'Invalid username/email or password.' },
          { status: 400 }
        )
      }

      const cleanInput = usernameOrEmail.trim().toLowerCase()

      const userRes = await db.query(
        `
        SELECT u.id, u.username, u.email, u.password_hash, u.role, u.is_active, p.id AS patient_id
        FROM users u
        LEFT JOIN patients p ON p.user_id = u.id
        WHERE (LOWER(u.username) = $1 OR LOWER(u.email) = $1)
          AND u.role = 'PATIENT'
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

      user = userRes.rows[0]

      const isValidPassword = await verifyPassword(password, user.password_hash)

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Invalid username/email or password.' },
          { status: 401 }
        )
      }
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: 'Account is suspended or inactive.' },
        { status: 403 }
      )
    }

    // Create real PostgreSQL session token
    const sessionToken = await createDBSession(user.id, UserRole.PATIENT, 7)

    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id])

    const response = NextResponse.json(
      {
        success: true,
        redirectUrl: '/patient/dashboard',
        message: 'Patient authentication successful.',
      },
      { status: 200 }
    )

    response.cookies.set({
      name: 'telemed_patient_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('PATIENT LOGIN ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Unable to connect to the server. Please try again.' },
      { status: 500 }
    )
  }
}
