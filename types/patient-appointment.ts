import { ConsultationType, RequestStatus } from './patient'

export type AppointmentStatusCategory = 'UPCOMING' | 'PAST' | 'CANCELLED'

export interface AppointmentTimelineStage {
  label: string
  status: 'COMPLETED' | 'CURRENT' | 'PENDING' | 'CANCELLED'
  timestamp?: string
}

export interface PatientAppointmentDetail {
  id: string
  consultationRequestId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorType: 'GENERAL_PHYSICIAN' | 'SPECIALIST'
  specialtyName?: string
  consultationType: ConsultationType
  problem: string
  appointmentDate: string // YYYY-MM-DD
  startTime: string      // HH:MM AM/PM
  endTime: string        // HH:MM AM/PM
  feeInINR: number
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED'
  appointmentStatus: RequestStatus
  cancellationReason?: string
  cancelledBy?: 'PATIENT' | 'DOCTOR' | 'SYSTEM'
  timeline: AppointmentTimelineStage[]
  isCancellable: boolean
  createdAt: string
}

export interface AppointmentCancellationRequest {
  appointmentId: string
  reason?: string
}
