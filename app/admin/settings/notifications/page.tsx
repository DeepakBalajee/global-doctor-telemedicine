import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { NotificationPreferencesForm } from '@/components/notifications/NotificationPreferencesForm'

export const metadata: Metadata = {
  title: 'Notification Settings | Admin Console',
  description: 'Manage admin notification channels and preferences.',
}

export default function AdminNotificationSettingsPage() {
  return (
    <AdminDashboardLayout role="ADMIN" adminName="Admin Head Console">
      <NotificationPreferencesForm />
    </AdminDashboardLayout>
  )
}
