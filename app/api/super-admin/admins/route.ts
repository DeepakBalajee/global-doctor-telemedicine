import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { createAdminHeadAccount } from '@/lib/admin/admin-store'
import { db } from '@/lib/db'

export async function GET() {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  try {
    const res = await db.query(
      `
      SELECT 
        a.id,
        a.user_id AS "userId",
        a.full_name AS "fullName",
        a.username,
        a.email,
        a.role,
        a.account_status AS "accountStatus",
        a.created_at AS "createdAt",
        a.last_login_at AS "lastLoginAt"
      FROM admin_accounts a
      ORDER BY a.created_at DESC
      `
    )
    return NextResponse.json(res.rows, { status: 200 })
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Only Super Admin can create Admin accounts.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden. Only Super Admin can create Admin accounts.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { fullName, username, email, password } = body

    if (!fullName?.trim() || !username?.trim()) {
      return NextResponse.json({ error: 'Full name and username are required.' }, { status: 400 })
    }

    const result = await createAdminHeadAccount({
      fullName,
      username,
      email,
      password,
      creatorUserId: session.userId,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      { success: true, admin: result.admin, message: 'Admin account created successfully.' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to create admin account.' }, { status: 500 })
  }
}
