import { DoctorProfile } from './doctor'
import { ConsultationType, RequestStatus } from './patient'

export interface DoctorDashboardStatistics {
  todayAppointmentsCount: number
  upcomingAppointmentsCount: number
  completedConsultationsCount: number
  totalPatientsCount: number
}

export interface DoctorAppointmentSummary {
  id: string
  consultationRequestId: string
  patientId: string
  patientName: string
  patientAge?: number
  patientGender?: string
  consultationType: ConsultationType
  problem: string
  appointmentDate: string
  preferredTime: string
  feeInINR: number
  paymentStatus: 'PAID' | 'PENDING'
  appointmentStatus: RequestStatus
  createdAt: string
}

export interface DoctorDashboardData {
  profile: DoctorProfile
  statistics: DoctorDashboardStatistics
  upcomingAppointments: DoctorAppointmentSummary[]
}
