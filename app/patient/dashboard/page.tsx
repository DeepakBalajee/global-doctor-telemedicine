import { Metadata } from 'next'
import { PatientDashboardView } from '@/components/patient/PatientDashboardView'

export const metadata: Metadata = {
  title: 'Patient Dashboard | Global Doctor Telemedicine Platform',
  description: 'Manage your appointments, personal profile, and verified consultation payment receipts.',
}

export default function PatientDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <PatientDashboardView />
    </div>
  )
}
