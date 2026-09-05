import { SecurityAuditSummary } from '@/types/security'

export async function fetchSecurityAuditResults(): Promise<SecurityAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/security/audit')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function runSecurityPenetrationTest(): Promise<SecurityAuditSummary | null> {
  try {
    const res = await fetch('/api/super-admin/security/audit', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
