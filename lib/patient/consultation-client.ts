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
    // Validate essential required fields client-side
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

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Generate secure reference ID (consultationRequestId)
    const referenceId = 'REQ-' + Math.random().toString(36).substring(2, 9).toUpperCase()

    const request: ConsultationRequest = {
      id: referenceId,
      consultationRequestId: referenceId,
      payload: {
        ...payload,
        patientDetails: {
          ...patientDetails,
          fullName: patientDetails.fullName.trim(),
          problem: patientDetails.problem.trim(),
          cityTownVillage: patientDetails.cityTownVillage.trim(),
        },
      },
      feeInINR: 5, // ₹5 appointment fee
      status: RequestStatus.PENDING_PAYMENT,
      createdAt: new Date().toISOString(),
    }

    return {
      success: true,
      data: request,
    }
  } catch {
    return {
      success: false,
      error: 'We couldn’t submit your request right now. Please try again.',
    }
  }
}
