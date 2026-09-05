import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { revokePrescription } from '@/lib/medical-records/prescription-store'

export async function POST(
  request: Request,
  { params }: { params: { prescriptionId: string } }
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

  const { prescriptionId } = params
  const res = await revokePrescription(prescriptionId, session.userId)

  if (!res.success) {
    return NextResponse.json({ error: res.error || 'Prescription not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, message: 'Prescription revoked successfully.' }, { status: 200 })
}
