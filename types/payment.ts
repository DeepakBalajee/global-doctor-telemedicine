export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED'

export type AppointmentStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_SUCCESS'
  | 'APPOINTMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_CANCELLED'

export interface PaymentOrder {
  orderId: string
  consultationRequestId: string
  amount: number // Always in smallest currency unit (e.g. 500 = ₹5.00 INR)
  currency: 'INR'
  status: PaymentStatus
  keyId: string // Public key exposed for checkout SDK
  createdAt: string
  expiresAt?: string
  isSimulated?: boolean
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  consultationRequestId: string
}

export interface PaymentVerificationResult {
  success: boolean
  status: PaymentStatus
  appointmentStatus: AppointmentStatus
  message: string
  receiptId?: string
  transactionTime?: string
  consultationRequestId?: string
}
