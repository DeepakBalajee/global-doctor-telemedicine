import { SuperAdminMasterMetrics, SuperAdminSearchResult, SuperAdminSearchResultCategory } from '@/types/super-admin'

export async function searchSuperAdminMaster(
  query: string,
  category: SuperAdminSearchResultCategory = 'ALL'
): Promise<SuperAdminSearchResult[]> {
  try {
    const response = await fetch(`/api/super-admin/search?q=${encodeURIComponent(query)}&category=${category}`)
    if (!response.ok) return []
    const data = await response.json()
    return data.results || []
  } catch {
    return []
  }
}

export async function fetchSuperAdminMetrics(): Promise<SuperAdminMasterMetrics | null> {
  try {
    const response = await fetch('/api/super-admin/dashboard')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchSuperAdminConsultations(): Promise<any[]> {
  try {
    const response = await fetch('/api/super-admin/consultations')
    if (!response.ok) return []
    const data = await response.json()
    return data.consultations || []
  } catch {
    return []
  }
}
