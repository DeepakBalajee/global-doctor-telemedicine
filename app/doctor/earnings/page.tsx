import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { DoctorEarningsView } from '@/components/financial/DoctorEarningsView'

export const metadata: Metadata = {
  title: 'Doctor Earnings & Financial Workstation | Doctor Portal',
  description: 'View consultation earnings, available balance, and request payouts.',
}

export default function DoctorEarningsPage() {
  return (
    <DoctorDashboardLayout>
      <DoctorEarningsView />
    </DoctorDashboardLayout>
  )
}
