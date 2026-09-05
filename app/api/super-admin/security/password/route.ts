import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { changeSuperAdminPassword } from '@/lib/admin/admin-store'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin session required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Super Admin session required.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    const result = await changeSuperAdminPassword(currentPassword, newPassword, session.userId)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      { success: true, message: 'Super Admin password updated successfully.' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })
  }
}
