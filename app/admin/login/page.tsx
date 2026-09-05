import { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Sign In | Global Doctor Telemedicine Platform',
  description: 'Authorized administrator portal login for platform management.',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <AdminLoginForm />
    </div>
  )
}
