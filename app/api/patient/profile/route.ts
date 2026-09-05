import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_patient_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  return NextResponse.json(
    {
      id: 'PAT-88190',
      userId: 'USR-PAT-88190',
      fullName: 'Anita Sharma',
      username: 'anita_sharma',
      email: 'anita.sharma@example.com',
      mobileNumber: '+91 98123 45678',
      dateOfBirth: '1992-06-15',
      age: 32,
      gender: 'FEMALE',
      preferredLanguage: 'hi',
      city: 'Delhi',
      town: 'South Delhi',
    },
    { status: 200 }
  )
}

export async function PUT(request: Request) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_patient_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    // Server ignores role or verification status mutation attempts!
    return NextResponse.json(
      {
        success: true,
        message: 'Patient profile updated successfully.',
        profile: {
          id: 'PAT-88190',
          userId: 'USR-PAT-88190',
          fullName: body.fullName || 'Anita Sharma',
          username: 'anita_sharma',
          email: body.email || 'anita.sharma@example.com',
          mobileNumber: body.mobileNumber || '+91 98123 45678',
          dateOfBirth: body.dateOfBirth || '1992-06-15',
          gender: body.gender || 'FEMALE',
          preferredLanguage: body.preferredLanguage || 'hi',
          city: body.city || 'Delhi',
          town: body.town || 'South Delhi',
        },
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
