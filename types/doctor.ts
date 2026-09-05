import { ConsultationType } from './patient'

export type DoctorType = 'GENERAL_PHYSICIAN' | 'SPECIALIST'

export type DoctorVerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED'

export type DoctorAccountStatus =
  | 'ACTIVE'
  | 'PENDING_VERIFICATION'
  | 'SUSPENDED'
  | 'DISABLED'

export interface DoctorRegistrationPayload {
  // 1. Account Details
  fullName: string
  username: string
  email: string
  mobileNumber: string
  password: string

  // 2. Doctor Category
  doctorType: DoctorType
  specialtyId?: string // Required when doctorType === 'SPECIALIST'
  specialtyName?: string

  // 3. Professional Credentials
  medicalQualification: string
  experienceYears: number
  licenseNumber: string
  licensingAuthority: string
  bio?: string

  // 4. Consultation & Location
  languages: string[]
  consultationModes: ConsultationType[]
  city: string
  town?: string
  state: string
  country: string

  // 5. Verification Documents (Foundation)
  qualificationCertName?: string
  licenseDocName?: string
  idProofName?: string
}

export interface DoctorProfile {
  id: string
  userId: string
  fullName: string
  username: string
  email: string
  mobileNumber: string
  doctorType: DoctorType
  specialtyId?: string
  specialtyName?: string
  medicalQualification: string
  experienceYears: number
  licenseNumber: string
  licensingAuthority: string
  bio?: string
  languages: string[]
  consultationModes: ConsultationType[]
  city: string
  town?: string
  state: string
  country: string
  verificationStatus: DoctorVerificationStatus
  accountStatus: DoctorAccountStatus
  createdAt: string
  updatedAt: string
}
