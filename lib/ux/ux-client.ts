import { UXAuditSummary } from '@/types/ux'

export async function fetchUXAuditStatus(): Promise<UXAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/ux/audit')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function runUXAuditSuite(): Promise<UXAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/ux/audit', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
