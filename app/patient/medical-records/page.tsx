import { Metadata } from 'next'
import { PatientMedicalRecordsView } from '@/components/medical-records/PatientMedicalRecordsView'

export const metadata: Metadata = {
  title: 'My Medical Records & Prescriptions | Patient Portal',
  description: 'View digital prescriptions, lab diagnostic reports, and consultation history.',
}

export default function PatientMedicalRecordsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PatientMedicalRecordsView />
    </div>
  )
}
