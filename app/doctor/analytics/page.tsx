import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorAnalyticsView } from '@/components/analytics/DoctorAnalyticsView'

export const metadata: Metadata = {
  title: 'Practice Analytics | Doctor Portal',
  description: 'View personal clinical practice metrics and patient statistics.',
}

export default function DoctorAnalyticsPage() {
  return (
    <DoctorDashboardLayout>
      <DoctorAnalyticsView />
    </DoctorDashboardLayout>
  )
}
