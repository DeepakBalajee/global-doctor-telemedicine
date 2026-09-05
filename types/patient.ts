export type GenderOption = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY'

export type ConsultationType = 'ONLINE_VIDEO' | 'ONLINE_AUDIO' | 'OFFLINE' | 'CHAT'

export interface PatientDetails {
  fullName: string
  dateOfBirth: string // YYYY-MM-DD
  age?: number
  gender: GenderOption
  problem: string     // Sensitive medical summary; protected from logs & URLs
  preferredLanguage: string
  cityTownVillage: string
}

export interface ConsultationRequestPayload {
  patientDetails: PatientDetails
  consultationType: ConsultationType
  appointmentDate: string // YYYY-MM-DD
  preferredTime: string   // HH:MM AM/PM
  doctorId?: string
  specialtyId?: string
}

export enum RequestStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  REQUESTED = 'REQUESTED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ConsultationRequest {
  id: string
  consultationRequestId: string
  payload: ConsultationRequestPayload
  feeInINR: number
  status: RequestStatus
  createdAt: string
}
