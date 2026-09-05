import { Metadata } from 'next'
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout'
import { AdminAnalyticsView } from '@/components/analytics/AdminAnalyticsView'

export const metadata: Metadata = {
  title: 'Operational Analytics | Admin Workstation',
  description: 'View permitted operational analytics for patient registration and appointments.',
}

export default function AdminAnalyticsPage() {
  return (
    <AdminDashboardLayout role="ADMIN" adminName="Admin Head Console">
      <AdminAnalyticsView />
    </AdminDashboardLayout>
  )
}
