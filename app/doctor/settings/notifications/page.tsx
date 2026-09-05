import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { NotificationPreferencesForm } from '@/components/notifications/NotificationPreferencesForm'

export const metadata: Metadata = {
  title: 'Notification Settings | Doctor Portal',
  description: 'Manage notification channels and preferences.',
}

export default function DoctorNotificationSettingsPage() {
  return (
    <DoctorDashboardLayout>
      <NotificationPreferencesForm />
    </DoctorDashboardLayout>
  )
}
