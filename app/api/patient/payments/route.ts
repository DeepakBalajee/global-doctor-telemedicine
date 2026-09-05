import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getAllFinancialTransactions } from '@/lib/financial/financial-store'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_patient_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const allTx = await getAllFinancialTransactions()
  const payments = allTx.filter((t) => t.patientId === session.patientId || t.patientId === session.userId)

  return NextResponse.json({ payments }, { status: 200 })
}
