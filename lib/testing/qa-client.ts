import { QASuiteSummary } from '@/types/qa'

export async function fetchQATestResults(): Promise<QASuiteSummary | null> {
  try {
    const res = await fetch('/api/super-admin/qa/run')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function runQATestSuite(): Promise<QASuiteSummary | null> {
  try {
    const res = await fetch('/api/super-admin/qa/run', { method: 'POST' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
