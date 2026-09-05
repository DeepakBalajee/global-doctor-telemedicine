import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorAvailabilityManager } from '@/components/doctor/availability/DoctorAvailabilityManager'

export const metadata: Metadata = {
  title: 'Doctor Availability Management | Global Doctor Telemedicine Platform',
  description: 'Configure your weekly working schedule, slot duration, breaks, and vacation leave dates.',
}

export default function DoctorAvailabilityPage() {
  return (
    <DoctorDashboardLayout>
      <DoctorAvailabilityManager />
    </DoctorDashboardLayout>
  )
}
