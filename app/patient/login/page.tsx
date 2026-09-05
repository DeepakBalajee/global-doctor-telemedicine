import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PatientLoginForm } from '@/components/patient/PatientLoginForm'

export const metadata: Metadata = {
  title: 'Patient Login | Global Doctor Telemedicine Platform',
  description: 'Sign in to your patient account to manage your appointments, consultations, and payment receipts.',
}

export default function PatientLoginPage() {
  return (
    <AuthLayout>
      <PatientLoginForm />
    </AuthLayout>
  )
}
