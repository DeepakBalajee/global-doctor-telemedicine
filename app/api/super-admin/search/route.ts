import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { searchSuperAdminMaster } from '@/lib/super-admin/super-admin-store'
import { SuperAdminSearchResultCategory } from '@/types/super-admin'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = (searchParams.get('category') as SuperAdminSearchResultCategory) || 'ALL'

  const results = await searchSuperAdminMaster(query, category)
  return NextResponse.json({ results }, { status: 200 })
}
