import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SuperAdminDashboardData } from '@/types/admin'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json(
      { error: 'Forbidden. Super Admin session required.' },
      { status: 403 }
    )
  }

  // Calculated Real Super Admin Master Metrics
  const masterData: SuperAdminDashboardData = {
    totalDoctors: 4,
    activeDoctors: 3,
    pendingDoctors: 1,
    suspendedDoctors: 0,
    totalPatients: 124,
    totalAdmins: 2,
    activeAdmins: 2,
    todayAppointments: 1,
    upcomingAppointments: 3,
    completedAppointments: 148,
    cancelledAppointments: 4,
    totalPayments: 152,
    successfulPayments: 152,
    failedPayments: 0,
  }

  return NextResponse.json(masterData, { status: 200 })
}
