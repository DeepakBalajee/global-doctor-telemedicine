import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { PatientRegistrationPayload } from '@/types/patient-auth'

export async function POST(request: Request) {
  const client = await db.connect()

  try {
    const payload: PatientRegistrationPayload = await request.json()

    const {
      fullName,
      username,
      email,
      mobileNumber,
      password,
      dateOfBirth,
      gender,
      preferredLanguage,
      city,
      town,
    } = payload

    if (
      !fullName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !mobileNumber?.trim() ||
      !password ||
      !dateOfBirth ||
      !gender ||
      !preferredLanguage ||
      !city?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required registration fields.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    const cleanUsername = username.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanMobileNumber = mobileNumber.trim()

    await client.query('BEGIN')

    const existingUser = await client.query(
      `
      SELECT id, username, email
      FROM users
      WHERE LOWER(username) = LOWER($1)
         OR LOWER(email) = LOWER($2)
      LIMIT 1
      `,
      [cleanUsername, cleanEmail]
    )

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK')

      const existing = existingUser.rows[0]

      if (
        existing.username &&
        existing.username.toLowerCase() === cleanUsername.toLowerCase()
      ) {
        return NextResponse.json(
          { error: 'Username is already registered.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Email address is already registered.' },
        { status: 400 }
      )
    }

    const userId = randomUUID()
    const patientId = randomUUID()
    const passwordHash = await hashPassword(password)

    await client.query(
      `
      INSERT INTO users (
        id,
        username,
        email,
        password_hash,
        role,
        name,
        is_active
      )
      VALUES ($1, $2, $3, $4, 'PATIENT', $5, true)
      `,
      [
        userId,
        cleanUsername,
        cleanEmail,
        passwordHash,
        fullName.trim(),
      ]
    )

    await client.query(
      `
      INSERT INTO patients (
        id,
        user_id,
        full_name,
        mobile_number,
        date_of_birth,
        gender,
        problem,
        preferred_language,
        city_town_village
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
      [
        patientId,
        userId,
        fullName.trim(),
        cleanMobileNumber,
        dateOfBirth,
        gender,
        '',
        preferredLanguage,
        [city.trim(), town?.trim()].filter(Boolean).join(', '),
      ]
    )

    await client.query(
      `
      INSERT INTO notification_preferences (
        user_id
      )
      VALUES ($1)
      `,
      [userId]
    )

    await client.query('COMMIT')

    return NextResponse.json(
      {
        success: true,
        redirectUrl: '/patient/login',
        message: 'Patient account created successfully. Please sign in.',
      },
      { status: 201 }
    )
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {}

    console.error('PATIENT REGISTRATION FAILED', error)

    if ((error as { code?: string })?.code === '23505') {
      return NextResponse.json(
        { error: 'Username or email address is already registered.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'We couldn’t create your patient account. Please try again.' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}