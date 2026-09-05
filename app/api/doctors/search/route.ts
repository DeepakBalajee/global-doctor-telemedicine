import { NextResponse } from 'next/server'
import { searchDoctorsInStore } from '@/lib/search/search-engine'
import { DoctorSearchParams } from '@/types/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const params: DoctorSearchParams = {
    query: searchParams.get('query') || undefined,
    doctorType: (searchParams.get('doctorType') as any) || undefined,
    specialization: searchParams.get('specialization') || undefined,
    location: searchParams.get('location') || undefined,
    availability: (searchParams.get('availability') as any) || undefined,
    consultationType: (searchParams.get('consultationType') as any) || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
  }

  const result = searchDoctorsInStore(params)
  return NextResponse.json(result, { status: 200 })
}
