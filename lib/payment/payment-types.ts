import { PaymentOrder, PaymentVerificationRequest, PaymentVerificationResult } from '@/types/payment'

export interface CreateOrderInput {
  consultationRequestId: string
}

export interface IPaymentProvider {
  name: string
  createOrder(input: CreateOrderInput): Promise<PaymentOrder>
  verifySignature(input: PaymentVerificationRequest): Promise<boolean>
  verifyWebhookSignature(body: string, signature: string): Promise<boolean>
}
