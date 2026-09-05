import { IntegrationAuditSummary } from '@/types/integration'

export async function fetchIntegrationAuditStatus(): Promise<IntegrationAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/integration/audit')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function runIntegrationCandidateAudit(): Promise<IntegrationAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/integration/audit', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
