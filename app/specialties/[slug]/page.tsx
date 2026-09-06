import { Metadata } from 'next'
import { DoctorDiscoveryPanel } from '@/components/search/DoctorDiscoveryPanel'

export const metadata: Metadata = {
  title: 'Specialty Doctors | Global Doctor Telemedicine Platform',
  description: 'Search verified specialist doctors.',
}

export default async function SpecialtyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <DoctorDiscoveryPanel initialSpecialty={slug} />
    </div>
  )
}
