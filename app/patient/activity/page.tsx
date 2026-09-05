import { Metadata } from 'next'
import { PatientActivityView } from '@/components/analytics/PatientActivityView'

export const metadata: Metadata = {
  title: 'My Activity & Health Summary | Patient Portal',
  description: 'View personal consultation activity, prescriptions, and health records summary.',
}

export default function PatientActivityPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PatientActivityView />
    </div>
  )
}
