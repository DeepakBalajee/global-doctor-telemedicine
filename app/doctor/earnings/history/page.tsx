import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorEarningsView } from '@/components/financial/DoctorEarningsView'

export const metadata: Metadata = {
  title: 'Full Earnings Ledger History | Doctor Portal',
  description: 'Detailed transaction ledger history of doctor earnings.',
}

export default function DoctorEarningsHistoryPage() {
  return (
    <DoctorDashboardLayout>
      <DoctorEarningsView />
    </DoctorDashboardLayout>
  )
}
