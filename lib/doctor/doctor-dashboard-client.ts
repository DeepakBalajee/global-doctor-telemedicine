import { DoctorDashboardData } from '@/types/doctor-dashboard'
import { DoctorProfile } from '@/types/doctor'

/**
 * Client API abstraction for fetching authenticated doctor dashboard data (GET /api/doctor/dashboard).
 */
export async function getDoctorDashboardData(): Promise<DoctorDashboardData | null> {
  try {
    const response = await fetch('/api/doctor/dashboard')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for fetching authenticated doctor profile (GET /api/doctor/profile).
 */
export async function getDoctorProfile(): Promise<DoctorProfile | null> {
  try {
    const response = await fetch('/api/doctor/profile')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for updating doctor profile (PUT /api/doctor/profile).
 */
export async function updateDoctorProfile(
  profileData: Partial<DoctorProfile>
): Promise<{ success: boolean; profile?: DoctorProfile; message?: string }> {
  try {
    const response = await fetch('/api/doctor/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.message || 'Update failed.' }
    return data
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}
