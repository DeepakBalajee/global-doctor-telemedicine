import { ConsultationType } from './patient'
import { UserRole } from './auth'

export type ConsultationSessionStatus =
  | 'SCHEDULED'
  | 'READY'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'

export interface ConsultationSession {
  id: string
  appointmentId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  specialtyName?: string
  consultationType: ConsultationType
  status: ConsultationSessionStatus
  startedAt?: string
  endedAt?: string
  durationMinutes?: number
  createdAt: string
  updatedAt: string
}

export interface ConsultationMessage {
  id: string
  consultationSessionId: string
  senderId: string
  senderName: string
  senderRole: UserRole
  message: string
  createdAt: string
}

export interface MediaCallState {
  isMicMuted: boolean
  isCameraOff: boolean
  connectionStatus: 'CONNECTING' | 'CONNECTED' | 'POOR_CONNECTION' | 'DISCONNECTED'
}
