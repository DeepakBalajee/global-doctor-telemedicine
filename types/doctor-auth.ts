import { DoctorProfile, DoctorVerificationStatus, DoctorAccountStatus } from './doctor'

export type DoctorAuthResponseStatus =
  | 'SUCCESS'
  | 'INVALID_CREDENTIALS'
  | 'PENDING_VERIFICATION'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'DISABLED'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'

export interface DoctorLoginCredentials {
  usernameOrEmail: string
  password?: string
  rememberMe?: boolean
}

export interface DoctorAuthResult {
  status: DoctorAuthResponseStatus
  doctor?: DoctorProfile
  message?: string
  redirectUrl?: string
  verificationStatus?: DoctorVerificationStatus
  accountStatus?: DoctorAccountStatus
}

export interface DoctorPasswordResetRequest {
  email: string
}
