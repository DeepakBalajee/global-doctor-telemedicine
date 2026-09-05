import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'
import { createDBSession } from '@/lib/auth/session'
import { ensureDatabaseSeeded } from '@/lib/db/seed-db'
import { DoctorAuthResult } from '@/types/doctor-auth'
import { UserRole } from '@/types/auth'

export async function POST(request: Request) {
  await ensureDatabaseSeeded()

  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body

    if (!usernameOrEmail?.trim() || !password) {
      const errorResult: DoctorAuthResult = {
        status: 'INVALID_CREDENTIALS',
        message: 'Invalid username/email or password.',
      }
      return NextResponse.json(errorResult, { status: 400 })
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase()

    const userRes = await db.query(
      `
      SELECT 
        u.id AS user_id,
        u.username,
        u.email,
        u.password_hash,
        u.role,
        u.is_active,
        d.id AS doctor_id,
        d.full_name,
        d.mobile_number,
        d.doctor_type,
        d.specialty_id,
        d.specialty_name,
        d.medical_qualification,
        d.experience_years,
        d.license_number,
        d.licensing_authority,
        d.bio,
        d.languages,
        d.consultation_modes,
        d.city,
        d.state,
        d.country,
        d.verification_status,
        d.account_status,
        d.created_at,
        d.updated_at
      FROM users u
      JOIN doctors d ON d.user_id = u.id
      WHERE (LOWER(u.username) = $1 OR LOWER(u.email) = $1)
        AND u.role = 'DOCTOR'
      LIMIT 1
      `,
      [cleanInput]
    )

    if (userRes.rows.length === 0) {
      const invalidResult: DoctorAuthResult = {
        status: 'INVALID_CREDENTIALS',
        message: 'Invalid username/email or password.',
      }
      return NextResponse.json(invalidResult, { status: 401 })
    }

    const row = userRes.rows[0]

    const isValidPassword = await verifyPassword(password, row.password_hash)

    if (!isValidPassword) {
      const invalidResult: DoctorAuthResult = {
        status: 'INVALID_CREDENTIALS',
        message: 'Invalid username/email or password.',
      }
      return NextResponse.json(invalidResult, { status: 401 })
    }

    // Check Verification & Account Statuses
    if (row.verification_status === 'PENDING' || row.account_status === 'PENDING_VERIFICATION') {
      const pendingResult: DoctorAuthResult = {
        status: 'PENDING_VERIFICATION',
        verificationStatus: 'PENDING',
        accountStatus: 'PENDING_VERIFICATION',
        redirectUrl: '/doctor/pending-verification',
        message: 'Your account has been registered successfully, but access to doctor services will be available after administrative verification.',
      }
      return NextResponse.json(pendingResult, { status: 200 })
    }

    if (row.verification_status === 'REJECTED') {
      const rejectedResult: DoctorAuthResult = {
        status: 'REJECTED',
        verificationStatus: 'REJECTED',
        accountStatus: 'PENDING_VERIFICATION',
        message: 'Your doctor account application has not been approved.',
      }
      return NextResponse.json(rejectedResult, { status: 403 })
    }

    if (row.account_status === 'SUSPENDED' || !row.is_active) {
      const suspendedResult: DoctorAuthResult = {
        status: 'SUSPENDED',
        verificationStatus: 'SUSPENDED',
        accountStatus: 'SUSPENDED',
        message: 'Your doctor account is currently suspended. Please contact support.',
      }
      return NextResponse.json(suspendedResult, { status: 403 })
    }

    // Verified & Active Doctor Authentication Success
    const sessionToken = await createDBSession(row.user_id, UserRole.DOCTOR, 1)

    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [row.user_id])

    const responseResult: DoctorAuthResult = {
      status: 'SUCCESS',
      verificationStatus: row.verification_status,
      accountStatus: row.account_status,
      redirectUrl: '/doctor/dashboard',
      message: 'Authentication successful.',
      doctor: {
        id: row.doctor_id,
        userId: row.user_id,
        fullName: row.full_name,
        username: row.username,
        email: row.email,
        mobileNumber: row.mobile_number,
        doctorType: row.doctor_type as any,
        specialtyId: row.specialty_id || undefined,
        specialtyName: row.specialty_name || undefined,
        medicalQualification: row.medical_qualification,
        experienceYears: row.experience_years,
        licenseNumber: row.license_number,
        licensingAuthority: row.licensing_authority,
        bio: row.bio || undefined,
        languages: typeof row.languages === 'string' ? JSON.parse(row.languages) : row.languages || [],
        consultationModes: typeof row.consultation_modes === 'string' ? JSON.parse(row.consultation_modes) : row.consultation_modes || [],
        city: row.city,
        state: row.state,
        country: row.country,
        verificationStatus: row.verification_status,
        accountStatus: row.account_status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    }

    const response = NextResponse.json(responseResult, { status: 200 })

    response.cookies.set({
      name: 'telemed_doc_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    console.error('DOCTOR LOGIN ERROR:', error)
    const serverErrorResult: DoctorAuthResult = {
      status: 'SERVER_ERROR',
      message: 'Unable to connect to the server. Please try again.',
    }
    return NextResponse.json(serverErrorResult, { status: 500 })
  }
}
