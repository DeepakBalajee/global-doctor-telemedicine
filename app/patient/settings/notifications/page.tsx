import { Metadata } from 'next'
import { NotificationPreferencesForm } from '@/components/notifications/NotificationPreferencesForm'

export const metadata: Metadata = {
  title: 'Notification Settings | Patient Portal',
  description: 'Manage notification channels and preferences.',
}

export default function PatientNotificationSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <NotificationPreferencesForm />
    </div>
  )
}
