import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { processPatientRefund } from '@/lib/financial/financial-store'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const result = await processPatientRefund(
      body.paymentId || 'PAY-88190-01',
      body.amount || 5.0,
      session.userId
    )

    return NextResponse.json({ success: result.success, message: 'Refund processed successfully.' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }
}
