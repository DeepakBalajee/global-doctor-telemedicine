import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { toggleAdminStatus } from '@/lib/admin/admin-store'

export async function PATCH(
  request: Request,
  { params }: { params: { adminId: string } }
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

  const { adminId } = params
  const result = await toggleAdminStatus(adminId, 'SUSPENDED', session.userId)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(
    { success: true, message: `Admin account ${adminId} suspended.` },
    { status: 200 }
  )
}
