import { ConsultationRequestPayload, ConsultationRequest, RequestStatus } from '@/types/patient'

/**
 * Client API abstraction for creating a pending consultation request.
 * Prepared for POST /api/patient/consultation-request.
 * Returns a secure reference consultationRequestId used for the ₹5 payment step.
 */
export async function createConsultationRequest(
  payload: ConsultationRequestPayload
): Promise<{ success: boolean; data?: ConsultationRequest; error?: string }> {
  try {
    const { patientDetails, consultationType, appointmentDate, preferredTime } = payload

    if (
      !patientDetails.fullName.trim() ||
      !patientDetails.dateOfBirth ||
      !patientDetails.gender ||
      !patientDetails.problem.trim() ||
      !patientDetails.preferredLanguage ||
      !patientDetails.cityTownVillage.trim() ||
      !consultationType ||
      !appointmentDate ||
      !preferredTime
    ) {
      return {
        success: false,
        error: 'Please fill in all required fields marked with an asterisk (*).',
      }
    }

    const response = await fetch('/api/patient/consultation-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const resData = await response.json()

    if (!response.ok || !resData.success) {
      return {
        success: false,
        error: resData.error || 'Failed to submit consultation request.',
      }
    }

    return {
      success: true,
      data: resData.data,
    }
  } catch {
    return {
      success: false,
      error: 'We couldn’t submit your request right now. Please try again.',
    }
  }
}
