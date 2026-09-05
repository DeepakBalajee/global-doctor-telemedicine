import { NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment/payment-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { consultationRequestId } = body

    if (!consultationRequestId) {
      return NextResponse.json(
        { error: 'consultationRequestId is required' },
        { status: 400 }
      )
    }

    // Server-authoritative order creation (₹5.00 INR = 500 paise)
    const paymentOrder = await paymentService.createConsultationPaymentOrder(consultationRequestId)

    return NextResponse.json(paymentOrder, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
