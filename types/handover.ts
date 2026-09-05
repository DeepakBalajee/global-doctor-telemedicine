export interface HandoverVectorResult {
  id: string
  vector: string
  status: 'PASS' | 'FAIL'
  details: string
}

export interface HandoverSummary {
  timestamp: string
  appVersion: string
  finalStatus: 'READY_AFTER_EXTERNAL_CONFIGURATION' | 'READY_FOR_DEPLOYMENT' | 'NOT_READY'
  buildStatus: {
    frontend: 'PASS' | 'FAIL'
    backend: 'PASS' | 'FAIL'
  }
  postgresqlStatus: 'PASS' | 'FAIL'
  securityStatus: 'PASS' | 'FAIL'
  paymentStatus: 'PASS' | 'FAIL'
  videoStatus: 'PASS' | 'FAIL'
  vectors: HandoverVectorResult[]
  externalRequiredConfig: string[]
}
