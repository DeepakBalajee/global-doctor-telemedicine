import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { processPayoutStatus } from '@/lib/financial/financial-store'

export async function POST(
  request: Request,
  { params }: { params: { payoutId: string } }
) {
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
    const res = await processPayoutStatus(
      params.payoutId,
      'PROCESSED',
      session.userId
    )

    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Payout processing failed.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Payout processed successfully.' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }
}
