import {
  WeeklyAvailabilitySlot,
  BlockedDateRange,
  DoctorAvailabilityConfig,
} from '@/types/availability'

/**
 * Client API abstraction for fetching doctor availability config (GET /api/doctor/availability).
 */
export async function getDoctorAvailability(): Promise<DoctorAvailabilityConfig | null> {
  try {
    const response = await fetch('/api/doctor/availability')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for saving weekly availability schedule (POST /api/doctor/availability).
 */
export async function saveWeeklyAvailability(
  weeklySlots: WeeklyAvailabilitySlot[]
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/doctor/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weeklySlots }),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Failed to update schedule.' }
    return { success: true, message: 'Weekly schedule updated successfully.' }
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}

/**
 * Client API abstraction for adding a blocked vacation date (POST /api/doctor/availability/blocked).
 */
export async function addBlockedDate(
  range: { startDate: string; endDate: string; reason?: string }
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/doctor/availability/blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(range),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Failed to add blocked date.' }
    return { success: true, message: 'Blocked vacation range saved.' }
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}
