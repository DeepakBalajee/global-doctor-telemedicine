export type UXAuditVector =
  | 'DESIGN_SYSTEM'
  | 'HEALTHCARE_STYLE'
  | 'NAVIGATION'
  | 'RESPONSIVENESS'
  | 'FORMS_UX'
  | 'SEARCH_UX'
  | 'APPOINTMENT_UX'
  | 'PAYMENT_UX'
  | 'VIDEO_UX'
  | 'MEDICAL_RECORDS_UX'
  | 'ACCESSIBILITY'
  | 'DESTRUCTIVE_CONFIRMATION'

export interface UXAuditItem {
  id: string
  vector: UXAuditVector
  title: string
  status: 'PASS' | 'FAIL'
  scorePercentage: number
  details: string
}

export interface UXAuditSummary {
  timestamp: string
  overallScore: number
  status: 'READY' | 'READY_WITH_MINOR_ISSUES' | 'NOT_READY'
  responsiveStatus: {
    desktop: 'PASS' | 'FAIL'
    tablet: 'PASS' | 'FAIL'
    mobile: 'PASS' | 'FAIL'
  }
  accessibilityScore: number
  auditItems: UXAuditItem[]
}
