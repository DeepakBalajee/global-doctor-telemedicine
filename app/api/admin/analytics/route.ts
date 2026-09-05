import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSuperAdminAnalytics } from '@/lib/analytics/analytics-store'

export async function GET() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('telemed_admin_session')
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!adminCookie && !superAdminCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const master = await getSuperAdminAnalytics('ALL_TIME')
  
  // Data minimization for standard Admin: operational analytics only, no sensitive raw revenue breakdown
  const adminData = {
    totalPatients: master.totalPatients,
    totalDoctors: master.totalDoctors,
    pendingDoctorsCount: master.pendingDoctorsCount,
    totalAppointments: master.totalAppointments,
    completedAppointments: master.completedAppointments,
    completionRatePercentage: master.completionRatePercentage,
  }

  return NextResponse.json(adminData, { status: 200 })
}
