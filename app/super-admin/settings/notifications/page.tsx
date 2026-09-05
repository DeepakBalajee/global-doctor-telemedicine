import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { NotificationPreferencesForm } from '@/components/notifications/NotificationPreferencesForm'

export const metadata: Metadata = {
  title: 'Notification Settings | Super Admin Console',
  description: 'Manage master platform notification channels and preferences.',
}

export default function SuperAdminNotificationSettingsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <NotificationPreferencesForm />
    </AdminDashboardLayout>
  )
}
