import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { NotificationCenterView } from '@/components/notifications/NotificationCenterView'

export const metadata: Metadata = {
  title: 'Master Notification Center | Super Admin Console',
  description: 'View master platform notifications and security alerts.',
}

export default function SuperAdminNotificationsPage() {
  return (
    <AdminDashboardLayout role="SUPER_ADMIN" adminName="Super Admin Master Control">
      <NotificationCenterView />
    </AdminDashboardLayout>
  )
}
