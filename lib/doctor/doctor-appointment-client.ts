import { PatientAppointmentDetail } from '@/types/patient-appointment'

/**
 * Client API abstraction for fetching doctor appointments list by tab category (GET /api/doctor/appointments?tab=...).
 */
export async function getDoctorAppointments(
  tab: 'today' | 'upcoming' | 'past' | 'cancelled' = 'upcoming'
): Promise<PatientAppointmentDetail[]> {
  try {
    const response = await fetch(`/api/doctor/appointments?tab=${tab}`)
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Client API abstraction for fetching specific doctor appointment details (GET /api/doctor/appointments/[appointmentId]).
 * Strict Doctor IDOR ownership check enforced on server.
 */
export async function getDoctorAppointmentDetail(
  appointmentId: string
): Promise<PatientAppointmentDetail | null> {
  try {
    const response = await fetch(`/api/doctor/appointments/${appointmentId}`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for updating doctor appointment status (PATCH /api/doctor/appointments/[appointmentId]).
 */
export async function updateDoctorAppointmentStatus(
  appointmentId: string,
  action: 'confirm' | 'complete' | 'cancel',
  reason?: string
): Promise<{ success: boolean; appointment?: PatientAppointmentDetail; message?: string }> {
  try {
    const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason }),
    })

    const data = await response.json()
    if (!response.ok) {
      return { success: false, message: data.error || 'Failed to update appointment status.' }
    }

    return { success: true, appointment: data.appointment, message: data.message || 'Appointment status updated.' }
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}
