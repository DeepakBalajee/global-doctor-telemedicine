import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { NotificationCenterView } from '@/components/notifications/NotificationCenterView'

export const metadata: Metadata = {
  title: 'Admin Notification Center | Admin Console',
  description: 'View platform operational notifications and alerts.',
}

export default function AdminNotificationsPage() {
  return (
    <AdminDashboardLayout role="ADMIN" adminName="Admin Head Console">
      <NotificationCenterView />
    </AdminDashboardLayout>
  )
}
