import { Metadata } from 'next'
import { SuperAdminLoginForm } from '@/components/admin/SuperAdminLoginForm'

export const metadata: Metadata = {
  title: 'Super Admin Sign In | Global Doctor Telemedicine Platform',
  description: 'Highest-privilege Super Admin control console login.',
}

export default function SuperAdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <SuperAdminLoginForm />
    </div>
  )
}
