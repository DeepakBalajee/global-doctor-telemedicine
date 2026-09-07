import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { validateDBSession } from '@/lib/auth/session'

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_patient_session')

  if (!sessionToken?.value) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(sessionToken.value)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 })
  }

  try {
    const patientRes = await db.query(
      `
      SELECT 
        p.id AS patient_id,
        p.user_id,
        p.full_name,
        p.mobile_number,
        p.date_of_birth,
        p.gender,
        p.preferred_language,
        p.city_town_village,
        u.username,
        u.email,
        u.name AS user_name
      FROM users u
      LEFT JOIN patients p ON p.user_id = u.id
      WHERE u.id = $1
      LIMIT 1
      `,
      [session.userId]
    )

    if (patientRes.rows.length > 0) {
      const row = patientRes.rows[0]
      const fullName = row.full_name || row.user_name || session.name || session.username || 'Patient'
      const locationParts = (row.city_town_village || '').split(',').map((s: string) => s.trim()).filter(Boolean)

      return NextResponse.json(
        {
          id: row.patient_id || session.patientId || `PAT-${session.userId.substring(0, 6)}`,
          userId: session.userId,
          fullName: fullName,
          username: row.username || session.username,
          email: row.email || session.email,
          mobileNumber: row.mobile_number || '',
          dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : '1995-01-01',
          gender: row.gender || 'PREFER_NOT_TO_SAY',
          preferredLanguage: (row.preferred_language || 'EN').toUpperCase(),
          city: locationParts[0] || 'General Location',
          town: locationParts[1] || '',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        id: session.patientId || `PAT-${session.userId.substring(0, 6)}`,
        userId: session.userId,
        fullName: session.name || session.username || 'Patient',
        username: session.username,
        email: session.email,
        mobileNumber: '',
        dateOfBirth: '1995-01-01',
        gender: 'PREFER_NOT_TO_SAY',
        preferredLanguage: 'EN',
        city: 'General Location',
        town: '',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Patient profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch patient profile.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_patient_session')

  if (!sessionToken?.value) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(sessionToken.value)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { fullName, email, mobileNumber, dateOfBirth, gender, preferredLanguage, city, town } = body

    if (fullName?.trim()) {
      await db.query('UPDATE users SET name = $1 WHERE id = $2', [fullName.trim(), session.userId])
      await db.query('UPDATE patients SET full_name = $1 WHERE user_id = $2', [fullName.trim(), session.userId])
    }

    if (mobileNumber?.trim() || dateOfBirth || gender || preferredLanguage || city || town) {
      const location = [city?.trim(), town?.trim()].filter(Boolean).join(', ')
      await db.query(
        `
        UPDATE patients 
        SET 
          mobile_number = COALESCE($1, mobile_number),
          date_of_birth = COALESCE($2, date_of_birth),
          gender = COALESCE($3, gender),
          preferred_language = COALESCE($4, preferred_language),
          city_town_village = CASE WHEN $5 <> '' THEN $5 ELSE city_town_village END
        WHERE user_id = $6
        `,
        [
          mobileNumber?.trim() || null,
          dateOfBirth || null,
          gender || null,
          preferredLanguage || null,
          location,
          session.userId,
        ]
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Patient profile updated successfully.',
        profile: {
          id: session.patientId || `PAT-${session.userId.substring(0, 6)}`,
          userId: session.userId,
          fullName: fullName?.trim() || session.name,
          username: session.username,
          email: email || session.email,
          mobileNumber: mobileNumber || '',
          dateOfBirth: dateOfBirth || '',
          gender: gender || 'PREFER_NOT_TO_SAY',
          preferredLanguage: preferredLanguage || 'EN',
          city: city || '',
          town: town || '',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Patient profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
