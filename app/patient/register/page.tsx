import { Metadata } from 'next'
import { PatientRegisterForm } from '@/components/patient/PatientRegisterForm'

export const metadata: Metadata = {
  title: 'Patient Account Registration | Global Doctor Telemedicine Platform',
  description: 'Create a patient account to manage doctor consultations and appointment receipts.',
}

export default function PatientRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full">
        <PatientRegisterForm />
      </div>
    </div>
  )
}
