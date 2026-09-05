import { Metadata } from 'next'
import { NotificationCenterView } from '@/components/notifications/NotificationCenterView'

export const metadata: Metadata = {
  title: 'Notification Center | Patient Portal',
  description: 'View real-time notifications and alerts.',
}

export default function PatientNotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <NotificationCenterView />
    </div>
  )
}
