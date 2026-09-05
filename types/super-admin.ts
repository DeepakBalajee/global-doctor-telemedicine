export type SuperAdminSearchResultCategory =
  | 'ALL'
  | 'PATIENT'
  | 'DOCTOR'
  | 'ADMIN'
  | 'APPOINTMENT'
  | 'CONSULTATION'
  | 'PRESCRIPTION'
  | 'DOCUMENT'
  | 'PAYMENT'

export interface SuperAdminSearchResult {
  id: string
  type: SuperAdminSearchResultCategory
  title: string
  subtitle: string
  url: string
  status?: string
  createdAt?: string
}

export interface SuperAdminMasterMetrics {
  // Users
  totalPatients: number
  activePatients: number
  suspendedPatients: number

  totalDoctors: number
  verifiedDoctors: number
  pendingDoctors: number
  rejectedDoctors: number
  suspendedDoctors: number

  totalAdmins: number
  activeAdmins: number
  suspendedAdmins: number

  // Appointments
  totalAppointments: number
  todayAppointments: number
  upcomingAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  pendingAppointments: number

  // Consultations
  totalConsultations: number
  activeConsultations: number
  completedConsultations: number
  cancelledConsultations: number

  // Medical
  totalMedicalRecords: number
  totalPrescriptions: number
  activePrescriptions: number
  revokedPrescriptions: number
  totalMedicalDocuments: number

  // Payments & Revenue
  totalPayments: number
  successfulPayments: number
  pendingPayments: number
  failedPayments: number
  totalRevenueInINR: number
}
