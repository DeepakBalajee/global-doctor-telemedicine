import { Metadata } from 'next'
import { DoctorDiscoveryPanel } from '@/components/search/DoctorDiscoveryPanel'

export const metadata: Metadata = {
  title: 'Find Doctors & Specialists | Global Doctor Telemedicine Platform',
  description: 'Search and filter board-certified General Physicians and Specialist Doctors.',
}

export default function PublicDoctorsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <DoctorDiscoveryPanel />
    </div>
  )
}
