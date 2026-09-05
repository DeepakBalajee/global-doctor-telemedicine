import { DateRangeFilter, DoctorPersonalAnalytics, PatientPersonalActivity, SuperAdminAnalyticsOverview } from '@/types/analytics'

export async function fetchSuperAdminAnalytics(
  dateRange: DateRangeFilter = 'ALL_TIME'
): Promise<SuperAdminAnalyticsOverview | null> {
  try {
    const response = await fetch(`/api/super-admin/analytics/overview?dateRange=${dateRange}`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchDoctorAnalytics(): Promise<DoctorPersonalAnalytics | null> {
  try {
    const response = await fetch('/api/doctor/analytics')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchPatientActivity(): Promise<PatientPersonalActivity | null> {
  try {
    const response = await fetch('/api/patient/activity')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchAdminAnalytics(): Promise<any> {
  try {
    const response = await fetch('/api/admin/analytics')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
