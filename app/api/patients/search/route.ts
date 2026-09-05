import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { searchPatientsInStore } from '@/lib/search/search-engine'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')
  const adminCookie = cookieStore.get('telemed_admin_session')

  if (!superAdminCookie && !adminCookie) {
    return NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || undefined
  const accountStatus = (searchParams.get('accountStatus') as any) || undefined

  const result = searchPatientsInStore({ query, accountStatus })
  return NextResponse.json(result, { status: 200 })
}
