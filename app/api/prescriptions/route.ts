import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { createPrescription } from '@/lib/medical-records/prescription-store'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_doc_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Only active doctors can issue prescriptions.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Forbidden. Only active doctors can issue prescriptions.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const result = await createPrescription({
      ...body,
      doctorUserId: session.userId,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create prescription.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, prescription: result.prescription }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }
}
