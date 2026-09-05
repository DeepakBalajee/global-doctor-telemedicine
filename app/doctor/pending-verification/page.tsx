import { Metadata } from 'next'
import { DoctorPendingVerificationCard } from '@/components/doctor/DoctorPendingVerificationCard'

export const metadata: Metadata = {
  title: 'Pending Verification | Global Doctor Telemedicine Platform',
  description: 'Your doctor profile is currently pending administrative verification.',
}

export default function DoctorPendingVerificationPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full">
        <DoctorPendingVerificationCard />
      </div>
    </div>
  )
}
