import { Metadata } from 'next'
import { PatientReceiptView } from '@/components/financial/PatientReceiptView'

export const metadata: Metadata = {
  title: 'Official Payment Receipt | Patient Portal',
  description: 'View and print official consultation payment receipt.',
}

export default function PatientReceiptPage({
  params,
}: {
  params: { paymentId: string }
}) {
  const payment = {
    id: params.paymentId,
    appointmentId: 'APP-77102',
    patientId: 'PAT-88190',
    patientName: 'Anita Sharma',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Sarah Jenkins',
    amount: 5.0,
    currency: 'INR',
    gateway: 'Razorpay',
    gatewayTransactionId: 'rzp_live_998120',
    status: 'PAID',
    paidAt: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PatientReceiptView payment={payment} />
    </div>
  )
}
