import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { executeMasterGlobalSearch } from '@/lib/search/search-engine'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('telemed_super_admin_session')?.value || cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const session = await validateDBSession(token)
  if (!session) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const result = await executeMasterGlobalSearch(q, session.role)
  return NextResponse.json(result, { status: 200 })
}
