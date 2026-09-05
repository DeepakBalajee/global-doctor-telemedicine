import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSuperAdminAnalytics } from '@/lib/analytics/analytics-store'
import { DateRangeFilter } from '@/types/analytics'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const dateRange = (searchParams.get('dateRange') as DateRangeFilter) || 'ALL_TIME'

  const data = getSuperAdminAnalytics(dateRange)
  return NextResponse.json(data, { status: 200 })
}
