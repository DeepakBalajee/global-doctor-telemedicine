import { Metadata } from 'next'
import { DoctorDiscoveryPanel } from '@/components/search/DoctorDiscoveryPanel'

export const metadata: Metadata = {
  title: 'Doctor Discovery & Search | Patient Portal',
  description: 'Search and filter verified General Physicians and Specialist Doctors.',
}

export default function PatientDoctorsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <DoctorDiscoveryPanel />
    </div>
  )
}
