import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  return NextResponse.json(
    {
      id: 'DOC-101',
      userId: 'USR-DOC-101',
      fullName: 'Dr. Sarah Jenkins',
      username: 'dr_jenkins',
      email: 'sarah.jenkins@globaltelemed.org',
      mobileNumber: '+91 98765 43210',
      doctorType: 'SPECIALIST',
      specialtyId: 'cardiology',
      specialtyName: 'Cardiology',
      medicalQualification: 'MD, FACC',
      experienceYears: 12,
      licenseNumber: 'MCI-889012',
      licensingAuthority: 'Medical Council of India',
      bio: 'Senior Cardiologist specializing in preventive heart health and non-invasive cardiovascular consultations.',
      languages: ['en', 'hi'],
      consultationModes: ['ONLINE_VIDEO', 'ONLINE_AUDIO'],
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      verificationStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
    },
    { status: 200 }
  )
}

export async function PUT(request: Request) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    // Server ignores role or verification status mutation attempts!
    return NextResponse.json(
      {
        success: true,
        message: 'Doctor profile updated successfully.',
        profile: {
          id: 'DOC-101',
          userId: 'USR-DOC-101',
          fullName: 'Dr. Sarah Jenkins',
          username: 'dr_jenkins',
          email: 'sarah.jenkins@globaltelemed.org',
          mobileNumber: body.mobileNumber || '+91 98765 43210',
          doctorType: 'SPECIALIST',
          specialtyId: 'cardiology',
          specialtyName: 'Cardiology',
          medicalQualification: 'MD, FACC',
          experienceYears: 12,
          licenseNumber: 'MCI-889012',
          licensingAuthority: 'Medical Council of India',
          bio: body.bio || 'Senior Cardiologist specializing in preventive heart health.',
          languages: body.languages || ['en', 'hi'],
          consultationModes: body.consultationModes || ['ONLINE_VIDEO', 'ONLINE_AUDIO'],
          city: body.city || 'Mumbai',
          state: body.state || 'Maharashtra',
          country: body.country || 'India',
          verificationStatus: 'VERIFIED',
          accountStatus: 'ACTIVE',
        },
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
