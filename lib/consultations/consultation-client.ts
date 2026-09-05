import { ConsultationSession, ConsultationMessage } from '@/types/consultation'

export async function getConsultationSession(
  appointmentId: string
): Promise<{ success: boolean; session?: ConsultationSession; error?: string }> {
  try {
    const response = await fetch(`/api/consultations/${appointmentId}`)
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to access consultation session.' }
    return { success: true, session: data.session }
  } catch {
    return { success: false, error: 'Unable to connect to server.' }
  }
}

export async function startConsultation(
  appointmentId: string
): Promise<{ success: boolean; session?: ConsultationSession; error?: string }> {
  try {
    const response = await fetch(`/api/consultations/${appointmentId}/start`, { method: 'POST' })
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to start consultation.' }
    return { success: true, session: data.session }
  } catch {
    return { success: false, error: 'Unable to connect to server.' }
  }
}

export async function endConsultation(
  appointmentId: string
): Promise<{ success: boolean; session?: ConsultationSession; error?: string }> {
  try {
    const response = await fetch(`/api/consultations/${appointmentId}/end`, { method: 'POST' })
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to end consultation.' }
    return { success: true, session: data.session }
  } catch {
    return { success: false, error: 'Unable to connect to server.' }
  }
}

export async function sendChatMessage(
  appointmentId: string,
  message: string
): Promise<{ success: boolean; message?: ConsultationMessage; error?: string }> {
  try {
    const response = await fetch(`/api/consultations/${appointmentId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to send message.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, error: 'Unable to connect to server.' }
  }
}

export const sendConsultationMessage = sendChatMessage

export async function getChatMessages(
  appointmentId: string
): Promise<ConsultationMessage[]> {
  try {
    const response = await fetch(`/api/consultations/${appointmentId}/chat`)
    if (!response.ok) return []
    const data = await response.json()
    return data.messages || []
  } catch {
    return []
  }
}

export const fetchConsultationMessages = getChatMessages
