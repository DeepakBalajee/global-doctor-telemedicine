import { HandoverSummary } from '@/types/handover'

export async function fetchHandoverAuditStatus(): Promise<HandoverSummary | null> {
  try {
    const res = await fetch('/api/super-admin/handover/audit')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function runHandoverCandidateAudit(): Promise<HandoverSummary | null> {
  try {
    const res = await fetch('/api/super-admin/handover/audit', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
