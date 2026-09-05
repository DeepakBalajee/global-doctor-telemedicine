import { GenderOption, ConsultationType, RequestStatus } from './patient'

export interface PatientProfile {
  id: string
  userId: string
  fullName: string
  username: string
  email: string
  mobileNumber: string
  dateOfBirth: string // YYYY-MM-DD
  age?: number
  gender: GenderOption
  preferredLanguage: string
  city: string
  town?: string
  village?: string
  createdAt: string
  updatedAt: string
}

export interface PatientLoginCredentials {
  usernameOrEmail: string
  password?: string
  rememberMe?: boolean
}

export interface PatientRegistrationPayload {
  fullName: string
  username: string
  email: string
  mobileNumber: string
  password: string
  dateOfBirth: string
  gender: GenderOption
  preferredLanguage: string
  city: string
  town?: string
}

export interface PatientAppointmentSummary {
  id: string
  consultationRequestId: string
  doctorId?: string
  doctorName?: string
  doctorType?: 'GENERAL_PHYSICIAN' | 'SPECIALIST'
  specialtyName?: string
  consultationType: ConsultationType
  problem: string
  appointmentDate: string
  preferredTime: string
  feeInINR: number
  paymentStatus: 'PAID' | 'PENDING'
  appointmentStatus: RequestStatus
  createdAt: string
}

export interface PatientDashboardData {
  profile: PatientProfile
  appointments: PatientAppointmentSummary[]
  totalConsultationsCount: number
  paidConsultationsCount: number
}
