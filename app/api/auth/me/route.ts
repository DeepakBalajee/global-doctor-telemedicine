import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { ensureDatabaseSeeded } from '@/lib/db/seed-db'

export async function GET() {
  await ensureDatabaseSeeded()
  const cookieStore = cookies()

  const patToken = cookieStore.get('telemed_patient_session')?.value
  const docToken = cookieStore.get('telemed_doc_session')?.value
  const admToken = cookieStore.get('telemed_admin_session')?.value
  const saToken = cookieStore.get('telemed_super_admin_session')?.value

  const token = patToken || docToken || admToken || saToken

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const session = await validateDBSession(token)

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: session.patientId || session.doctorId || session.adminId || session.userId,
        userId: session.userId,
        role: session.role,
        fullName: session.name,
        username: session.username,
        email: session.email,
        verificationStatus: session.verificationStatus,
        accountStatus: session.accountStatus,
      },
    },
    { status: 200 }
  )
}
