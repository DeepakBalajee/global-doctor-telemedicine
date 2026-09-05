import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PatientProfile } from '@/types/patient-auth'

const adminPatientsList: PatientProfile[] = [
  {
    id: 'PAT-88190',
    userId: 'USR-PAT-88190',
    fullName: 'Anita Sharma',
    username: 'anita_sharma',
    email: 'anita.sharma@example.com',
    mobileNumber: '+91 98765 11122',
    dateOfBirth: '1994-05-12',
    age: 32,
    gender: 'FEMALE',
    preferredLanguage: 'en',
    city: 'Mumbai',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PAT-90211',
    userId: 'USR-PAT-90211',
    fullName: 'Rajesh Kumar',
    username: 'rajesh_k',
    email: 'rajesh.k@example.com',
    mobileNumber: '+91 98111 33344',
    dateOfBirth: '1981-11-20',
    age: 45,
    gender: 'MALE',
    preferredLanguage: 'hi',
    city: 'Delhi',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('telemed_admin_session')
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!adminCookie && !superAdminCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  return NextResponse.json(adminPatientsList, { status: 200 })
}
