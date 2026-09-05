import { Metadata } from 'next'
import { DoctorMultiStepForm } from '@/components/doctor/DoctorMultiStepForm'

export const metadata: Metadata = {
  title: 'Doctor Registration | Global Doctor Telemedicine Platform',
  description: 'Register as a General Physician or Medical Specialist to join our global telemedicine healthcare network.',
}

export default function DoctorRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full">
        <DoctorMultiStepForm />
      </div>
    </div>
  )
}
