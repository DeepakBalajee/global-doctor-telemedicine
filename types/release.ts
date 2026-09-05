export interface SubsystemAuditResult {
  subsystem: string
  status: 'PASS' | 'FAIL'
  details: string
}

export interface DeploymentChecklistItem {
  id: string
  category: 'APPLICATION' | 'DATABASE' | 'SECURITY' | 'HEALTHCARE' | 'APPOINTMENTS' | 'PAYMENTS' | 'VIDEO' | 'ADMINISTRATION'
  title: string
  completed: boolean
}

export interface ReleaseAuditSummary {
  timestamp: string
  overallStatus: 'READY' | 'READY_WITH_EXTERNAL_CONFIG' | 'NOT_READY'
  buildStatus: {
    frontend: 'PASS' | 'FAIL'
    backend: 'PASS' | 'FAIL'
  }
  databaseStatus: {
    postgresql: 'PASS' | 'FAIL'
    migrations: 'PASS' | 'FAIL'
  }
  subsystems: SubsystemAuditResult[]
  deploymentChecklist: DeploymentChecklistItem[]
  externalRequirements: string[]
}
