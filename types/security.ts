export type SecurityCategory =
  | 'AUTH'
  | 'IDOR'
  | 'RBAC'
  | 'XSS'
  | 'PAYMENT'
  | 'SINGLE_SUPER_ADMIN'
  | 'FILE_SECURITY'
  | 'SECRET_ISOLATION'

export interface PenetrationTestResult {
  id: string
  category: SecurityCategory
  testName: string
  status: 'PASSED' | 'FAILED'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  details: string
  executedAt: string
}

export interface SecurityAuditSummary {
  timestamp: string
  totalTests: number
  passedCount: number
  failedCount: number
  securityPosture: 'SECURE' | 'DEGRADED' | 'VULNERABLE'
  results: PenetrationTestResult[]
}
