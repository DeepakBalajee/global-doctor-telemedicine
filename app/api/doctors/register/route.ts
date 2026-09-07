import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { DoctorRegistrationPayload } from '@/types/doctor'
import { SPECIALTIES_DATA } from '@/data/specialties'

export async function POST(request: Request) {
  const client = await db.connect()

  try {
    const payload: DoctorRegistrationPayload = await request.json()

    const {
      fullName,
      username,
      email,
      mobileNumber,
      password,
      doctorType,
      specialtyId,
      medicalQualification,
      experienceYears,
      licenseNumber,
      licensingAuthority,
      languages,
      consultationModes,
      city,
      state,
      country,
    } = payload

    // 1. Basic required fields validation
    if (
      !fullName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !mobileNumber?.trim() ||
      !password ||
      !doctorType ||
      !medicalQualification?.trim() ||
      experienceYears === undefined ||
      !licenseNumber?.trim() ||
      !licensingAuthority?.trim() ||
      !languages?.length ||
      !consultationModes?.length ||
      !city?.trim() ||
      !state?.trim() ||
      !country?.trim()
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

    // 2. Doctor Type Specific Validation
    if (doctorType === 'SPECIALIST' && !specialtyId) {
      return NextResponse.json(
        { error: 'Specialists must select a valid medical specialization.' },
        { status: 400 }
      )
    }

    // Resolve specialty name if provided
    let specialtyName = 'General (MBBS)'
    if (doctorType === 'SPECIALIST' && specialtyId) {
      const foundSpecialty = SPECIALTIES_DATA.find((s) => s.id === specialtyId || s.slug === specialtyId)
      specialtyName = foundSpecialty ? foundSpecialty.name : specialtyId
    }

    const cleanUsername = username.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanMobileNumber = mobileNumber.trim()
    const cleanLicenseNumber = licenseNumber.trim()

    await client.query('BEGIN')

    // 3. Uniqueness Check in PostgreSQL users & doctors tables
    const existingUser = await client.query(
      `
      SELECT id, username, email
      FROM users
      WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
      LIMIT 1
      `,
      [cleanUsername, cleanEmail]
    )

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK')
      const existing = existingUser.rows[0]
      if (existing.username && existing.username.toLowerCase() === cleanUsername.toLowerCase()) {
        return NextResponse.json({ error: 'Username is already registered.' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Email address is already registered.' }, { status: 400 })
    }

    const existingLicense = await client.query(
      `
      SELECT id FROM doctors WHERE LOWER(license_number) = LOWER($1) LIMIT 1
      `,
      [cleanLicenseNumber]
    )

    if (existingLicense.rows.length > 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Medical license number is already registered.' }, { status: 400 })
    }

    // 4. Create User & Doctor in PostgreSQL
    const userId = randomUUID()
    const doctorId = randomUUID()
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
      VALUES ($1, $2, $3, $4, 'DOCTOR', $5, true)
      `,
      [userId, cleanUsername, cleanEmail, passwordHash, fullName.trim()]
    )

    await client.query(
      `
      INSERT INTO doctors (
        id,
        user_id,
        full_name,
        mobile_number,
        type,
        specialty_id,
        specialty_name,
        medical_qualification,
        experience_years,
        license_number,
        licensing_authority,
        bio,
        languages,
        consultation_modes,
        city,
        state,
        country,
        verification_status,
        account_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'APPROVED', 'ACTIVE')
      `,
      [
        doctorId,
        userId,
        fullName.trim(),
        cleanMobileNumber,
        doctorType,
        doctorType === 'SPECIALIST' ? specialtyId : null,
        specialtyName,
        medicalQualification.trim(),
        Number(experienceYears),
        cleanLicenseNumber,
        licensingAuthority.trim(),
        payload.bio?.trim() || '',
        JSON.stringify(languages),
        JSON.stringify(consultationModes),
        city.trim(),
        state.trim(),
        country.trim(),
      ]
    )

    await client.query('COMMIT')

    return NextResponse.json(
      {
        success: true,
        doctorId,
        verificationStatus: 'APPROVED',
        accountStatus: 'ACTIVE',
        message: 'Doctor account created successfully. You can now sign in.',
      },
      { status: 201 }
    )
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {}

    console.error('DOCTOR REGISTRATION ERROR:', error)

    return NextResponse.json(
      { error: 'We couldn’t process your doctor registration. Please try again.' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
