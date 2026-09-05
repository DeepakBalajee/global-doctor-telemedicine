import { PatientAppointmentDetail } from '@/types/patient-appointment'

/**
 * Client API abstraction for fetching patient appointment list by tab category (GET /api/patient/appointments?tab=...).
 */
export async function getPatientAppointments(
  tab: 'upcoming' | 'past' | 'cancelled' = 'upcoming'
): Promise<PatientAppointmentDetail[]> {
  try {
    const response = await fetch(`/api/patient/appointments?tab=${tab}`)
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Client API abstraction for fetching specific patient appointment details (GET /api/patient/appointments/[appointmentId]).
 * Strict IDOR ownership check enforced on server.
 */
export async function getPatientAppointmentDetail(
  appointmentId: string
): Promise<PatientAppointmentDetail | null> {
  try {
    const response = await fetch(`/api/patient/appointments/${appointmentId}`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for cancelling an eligible appointment (POST /api/patient/appointments/[appointmentId]/cancel).
 */
export async function cancelPatientAppointment(
  appointmentId: string,
  reason?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/patient/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId, reason }),
    })

    const data = await response.json()
    if (!response.ok) {
      return { success: false, message: data.error || 'Failed to cancel appointment.' }
    }

    return { success: true, message: data.message || 'Appointment cancelled successfully.' }
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}
