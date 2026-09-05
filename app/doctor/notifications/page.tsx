import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { NotificationCenterView } from '@/components/notifications/NotificationCenterView'

export const metadata: Metadata = {
  title: 'Doctor Notification Center | Doctor Portal',
  description: 'View practice notifications and appointment alerts.',
}

export default function DoctorNotificationsPage() {
  return (
    <DoctorDashboardLayout>
      <NotificationCenterView />
    </DoctorDashboardLayout>
  )
}
