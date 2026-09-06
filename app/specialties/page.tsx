import { Metadata } from 'next'
import { DoctorDiscoveryPanel } from '@/components/search/DoctorDiscoveryPanel'

export const metadata: Metadata = {
  title: 'Medical Specialties & Specialists | Global Doctor Telemedicine Platform',
  description: 'Explore board-certified medical specialists across healthcare domains.',
}

export default function PublicSpecialtiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <DoctorDiscoveryPanel />
    </div>
  )
}
