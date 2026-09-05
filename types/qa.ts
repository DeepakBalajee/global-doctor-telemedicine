export type QAModuleCategory =
  | 'DATABASE'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DOCTOR'
  | 'PATIENT'
  | 'GUEST'
  | 'SEARCH'
  | 'APPOINTMENT'
  | 'PAYMENT'
  | 'MEDICAL_RECORDS'
  | 'PRESCRIPTIONS'
  | 'VIDEO'
  | 'INFRASTRUCTURE'

export interface QATestResult {
  id: string
  module: QAModuleCategory
  testName: string
  status: 'PASSED' | 'FAILED'
  durationMs: number
  details: string
  executedAt: string
}

export interface QASuiteSummary {
  timestamp: string
  totalTests: number
  passedCount: number
  failedCount: number
  passRatePercentage: number
  status: 'PASSED' | 'FAILED'
  results: QATestResult[]
}
