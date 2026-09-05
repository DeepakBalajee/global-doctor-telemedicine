import { Metadata } from 'next'
import { PatientPaymentsView } from '@/components/financial/PatientPaymentsView'

export const metadata: Metadata = {
  title: 'My Payment History & Receipts | Patient Portal',
  description: 'View verified consultation payment receipts and transaction records.',
}

export default function PatientPaymentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <PatientPaymentsView />
    </div>
  )
}
