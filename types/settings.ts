export interface PlatformSettings {
  platformName: string
  supportEmail: string
  supportPhone: string
  timezone: string
  currency: 'INR' // Fixed to INR
  consultationFeeInINR: number // Fixed to 5.00 INR
  maintenanceMode: boolean
  maintenanceMessage: string
  doctorRegistrationEnabled: boolean
  doctorVerificationRequired: boolean
  patientRegistrationEnabled: boolean
  guestInspectionEnabled: boolean
  minPasswordLength: number
  sessionTimeoutMinutes: number
  rateLimitRequestsPerMin: number
  updatedAt: string
  updatedBy?: string
}

export interface PublicSettings {
  platformName: string
  supportEmail: string
  supportPhone: string
  maintenanceMode: boolean
  maintenanceMessage: string
  guestInspectionEnabled: boolean
}
