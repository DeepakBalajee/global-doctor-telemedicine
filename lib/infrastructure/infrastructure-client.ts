import { ReadinessStatus } from '@/lib/infrastructure/health-checker'

export async function fetchProductionReadinessCheck(): Promise<ReadinessStatus | null> {
  try {
    const res = await fetch('/api/health/readiness')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchProductionInfrastructureStatus(): Promise<any | null> {
  try {
    const res = await fetch('/api/super-admin/infrastructure/status')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
