import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { requestDoctorPayout, getAllPayouts } from '@/lib/financial/financial-store'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_doc_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const allPayouts = await getAllPayouts()
  const payouts = allPayouts.filter((p) => p.doctorId === session.doctorId || p.doctorId === session.userId)
  return NextResponse.json({ payouts }, { status: 200 })
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_doc_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await requestDoctorPayout({
      doctorUserId: session.userId,
      amount: body.amount || 4.5,
      payoutMethod: body.payoutMethod || 'Bank Transfer',
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, payout: result.payout }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid payout payload.' }, { status: 400 })
  }
}
