import { DoctorProfile } from '@/types/doctor'
import { GeneratedAppointmentSlot } from '@/types/availability'
import { ConsultationType } from '@/types/patient'

/**
 * Client API abstraction for patient doctor search (GET /api/doctors).
 * Exposes ONLY VERIFIED + ACTIVE doctors.
 */
export async function getVerifiedDoctors(filters?: {
  specialtyId?: string
  doctorType?: string
  search?: string
}): Promise<DoctorProfile[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.specialtyId) params.append('specialtyId', filters.specialtyId)
    if (filters?.doctorType) params.append('doctorType', filters.doctorType)
    if (filters?.search) params.append('search', filters.search)

    const response = await fetch(`/api/doctors?${params.toString()}`)
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Client API abstraction for retrieving calculated appointment slots for a specific doctor & date (GET /api/doctors/[doctorId]/slots?date=YYYY-MM-DD).
 */
export async function getDoctorAvailableSlots(
  doctorId: string,
  date: string
): Promise<GeneratedAppointmentSlot[]> {
  try {
    const response = await fetch(`/api/doctors/${doctorId}/slots?date=${date}`)
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Client API abstraction for atomic appointment slot reservation before payment (POST /api/appointments/reserve).
 */
export async function reserveAppointmentSlot(payload: {
  doctorId: string
  date: string
  startTime: string
  consultationType: ConsultationType
  patientDetails: any
}): Promise<{ success: boolean; consultationRequestId?: string; error?: string }> {
  try {
    const response = await fetch('/api/appointments/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) {
      return { success: false, error: data.error || 'This slot is no longer available. Please choose another time.' }
    }

    return data
  } catch {
    return { success: false, error: 'Unable to connect to server.' }
  }
}
