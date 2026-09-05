import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getDoctorEarningsSummary, getDoctorTransactions, getAllPayouts } from '@/lib/financial/financial-store'

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

  const doctorId = session.doctorId || session.userId
  const summary = await getDoctorEarningsSummary(session.userId)
  const transactions = await getDoctorTransactions(session.userId)
  const allPayouts = await getAllPayouts()
  const payouts = allPayouts.filter((p) => p.doctorId === doctorId || p.doctorId === session.userId)

  return NextResponse.json({ summary, transactions, payouts }, { status: 200 })
}
