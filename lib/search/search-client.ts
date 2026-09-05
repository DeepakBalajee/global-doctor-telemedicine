import { AppointmentSearchParams, DoctorSearchParams, DoctorSearchResponse, GlobalSearchResult, PatientSearchParams } from '@/types/search'

export async function fetchDoctorSearchResults(params: DoctorSearchParams): Promise<DoctorSearchResponse | null> {
  try {
    const queryParams = new URLSearchParams()
    if (params.query) queryParams.set('query', params.query)
    if (params.doctorType) queryParams.set('doctorType', params.doctorType)
    if (params.specialization) queryParams.set('specialization', params.specialization)
    if (params.location) queryParams.set('location', params.location)
    if (params.availability) queryParams.set('availability', params.availability)
    if (params.consultationType) queryParams.set('consultationType', params.consultationType)

    const res = await fetch(`/api/doctors/search?${queryParams.toString()}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchPatientSearchResults(params: PatientSearchParams): Promise<{ results: any[]; total: number } | null> {
  try {
    const queryParams = new URLSearchParams()
    if (params.query) queryParams.set('query', params.query)
    if (params.accountStatus) queryParams.set('accountStatus', params.accountStatus)

    const res = await fetch(`/api/patients/search?${queryParams.toString()}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchAppointmentSearchResults(params: AppointmentSearchParams): Promise<{ results: any[]; total: number } | null> {
  try {
    const queryParams = new URLSearchParams()
    if (params.query) queryParams.set('query', params.query)
    if (params.status) queryParams.set('status', params.status)

    const res = await fetch(`/api/appointments/search?${queryParams.toString()}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchGlobalSearchResults(query: string): Promise<GlobalSearchResult | null> {
  try {
    const res = await fetch(`/api/super-admin/global-search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
