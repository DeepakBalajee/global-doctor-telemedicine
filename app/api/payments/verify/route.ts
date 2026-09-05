import { NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment/payment-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, consultationRequestId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid verification parameters.' },
        { status: 400 }
      )
    }

    // Mandatory server HMAC signature verification
    const result = await paymentService.verifyPaymentAndConfirmAppointment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      consultationRequestId: consultationRequestId || 'REQ-UNKNOWN',
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: 'FAILED',
        appointmentStatus: 'PAYMENT_FAILED',
        message: 'Unable to verify payment right now. Please try again.',
      },
      { status: 500 }
    )
  }
}
