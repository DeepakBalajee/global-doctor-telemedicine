export interface DoctorSearchParams {
  query?: string
  doctorType?: 'ALL' | 'GENERAL' | 'SPECIALIST'
  specialization?: string
  location?: string
  language?: string
  availability?: 'ALL' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK'
  consultationType?: 'ALL' | 'ONLINE_VIDEO' | 'ONLINE_AUDIO' | 'OFFLINE'
  page?: number
  limit?: number
}

export interface PatientSearchParams {
  query?: string
  accountStatus?: 'ALL' | 'ACTIVE' | 'SUSPENDED'
  page?: number
  limit?: number
}

export interface AppointmentSearchParams {
  query?: string
  status?: string
  consultationType?: string
  paymentStatus?: string
  page?: number
  limit?: number
}

export interface SearchResultPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DoctorSearchResponse {
  results: any[]
  pagination: SearchResultPagination
  specializations: string[]
  locations: string[]
}

export interface GlobalSearchResult {
  query: string
  doctors: any[]
  patients: any[]
  appointments: any[]
  payments: any[]
  prescriptions: any[]
}
