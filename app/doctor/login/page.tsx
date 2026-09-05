import { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { DoctorLoginForm } from '@/components/doctor/DoctorLoginForm'

export const metadata: Metadata = {
  title: 'Doctor Login | Global Doctor Telemedicine Platform',
  description: 'Sign in to access your doctor account, consultation schedule, and clinical workstation.',
}

export default function DoctorLoginPage() {
  return (
    <AuthLayout>
      <DoctorLoginForm />
    </AuthLayout>
  )
}
