import { Metadata } from 'next'
import { PatientDetailsForm } from '@/components/patient/PatientDetailsForm'

export const metadata: Metadata = {
  title: 'Request Patient Consultation | Global Doctor Telemedicine Platform',
  description: 'Enter your patient details and appointment preferences to request a secure doctor consultation.',
}

export default function ConsultationRequestPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full">
        <PatientDetailsForm />
      </div>
    </div>
  )
}
