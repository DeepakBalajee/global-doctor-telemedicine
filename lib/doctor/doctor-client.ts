import { DoctorRegistrationPayload, DoctorVerificationStatus } from '@/types/doctor'

export interface DoctorRegistrationResult {
  success: boolean
  doctorId?: string
  verificationStatus?: DoctorVerificationStatus
  message?: string
  error?: string
}

/**
 * Client API abstraction for doctor registration (POST /api/doctors/register).
 */
export async function registerDoctor(
  payload: DoctorRegistrationPayload
): Promise<DoctorRegistrationResult> {
  try {
    const response = await fetch('/api/doctors/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to submit doctor registration.',
      }
    }

    return data
  } catch {
    return {
      success: false,
      error: 'We couldn’t submit your registration right now. Please try again.',
    }
  }
}
