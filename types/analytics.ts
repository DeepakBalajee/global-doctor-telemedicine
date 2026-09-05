export type DateRangeFilter =
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_YEAR'
  | 'ALL_TIME'

export interface SpecializationDistribution {
  specialtyName: string
  doctorCount: number
  appointmentCount: number
}

export interface SecurityAnalyticsSummary {
  totalAuditEvents: number
  failedLogins: number
  idorAttempts: number
  roleEscalationAttempts: number
  criticalEvents: number
  highEvents: number
}

export interface SuperAdminAnalyticsOverview {
  dateRange: DateRangeFilter
  
  // Users
  totalPatients: number
  newPatientsCount: number
  totalDoctors: number
  verifiedDoctorsCount: number
  pendingDoctorsCount: number
  totalAdmins: number

  // Appointments & Consultations
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  completionRatePercentage: number
  cancellationRatePercentage: number
  averageConsultationDurationMinutes: number

  // Specializations
  specializationBreakdown: SpecializationDistribution[]

  // Financials
  grossRevenueInINR: number
  platformRevenueInINR: number // 10%
  doctorEarningsInINR: number  // 90%
  refundsCount: number
  refundsAmountInINR: number

  // Medical
  prescriptionsIssuedCount: number
  prescriptionsRevokedCount: number
  medicalDocumentsUploadedCount: number

  // Security
  security: SecurityAnalyticsSummary

  // System
  systemStatus: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE'
}

export interface DoctorPersonalAnalytics {
  doctorId: string
  doctorName: string
  totalAppointments: number
  completedConsultations: number
  cancelledConsultations: number
  uniquePatientsServed: number
  prescriptionsIssued: number
  totalEarningsInINR: number
  availableBalanceInINR: number
}

export interface PatientPersonalActivity {
  patientId: string
  patientName: string
  totalAppointments: number
  completedConsultations: number
  totalPaymentsInINR: number
  prescriptionsCount: number
  documentsCount: number
}
