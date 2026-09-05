import { ReleaseAuditSummary } from '@/types/release'

export async function fetchReleaseAuditStatus(): Promise<ReleaseAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/release/audit')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function runReleaseCandidateAudit(): Promise<ReleaseAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/release/audit', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
