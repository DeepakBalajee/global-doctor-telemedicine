import { Metadata } from 'next'
import { PaymentCheckoutContainer } from '@/components/payment/PaymentCheckoutContainer'

export const metadata: Metadata = {
  title: 'Consultation Fee Payment (₹5) | Global Doctor Telemedicine Platform',
  description: 'Complete the secure ₹5 consultation fee payment to verify and confirm your doctor appointment.',
}

export default async function PatientPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ consultationRequestId?: string }>
}) {
  const params = await searchParams
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full">
        <PaymentCheckoutContainer consultationRequestId={params?.consultationRequestId} />
      </div>
    </div>
  )
}
