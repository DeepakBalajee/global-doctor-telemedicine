export interface IntegrationCheckResult {
  id: string
  flowName: string
  status: 'PASS' | 'FAIL'
  latencyMs: number
  details: string
}

export interface IntegrationAuditSummary {
  timestamp: string
  decision: 'INTEGRATION_READY' | 'INTEGRATION_READY_WITH_MINOR_ISSUES' | 'NOT_INTEGRATION_READY'
  passCount: number
  failCount: number
  passRatePercentage: number
  checks: IntegrationCheckResult[]
}
