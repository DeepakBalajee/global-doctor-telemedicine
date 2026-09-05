import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getAllFinancialTransactions, getAllPayouts } from '@/lib/financial/financial-store'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const transactions = await getAllFinancialTransactions()
  const payouts = await getAllPayouts()
  const totalRevenue = transactions
    .filter((t) => (t.type === 'PATIENT_PAYMENT' || (t.type as string) === 'CONSULTATION_FEE') && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)

  return NextResponse.json({ transactions, payouts, totalRevenue }, { status: 200 })
}
