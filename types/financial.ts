export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'

export type TransactionType =
  | 'PATIENT_PAYMENT'
  | 'PLATFORM_FEE'
  | 'DOCTOR_EARNING'
  | 'REFUND'
  | 'PAYOUT'
  | 'ADJUSTMENT'

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface FinancialTransaction {
  id: string
  paymentId?: string
  appointmentId?: string
  patientId?: string
  patientName?: string
  doctorId?: string
  doctorName?: string
  type: TransactionType
  amount: number
  currency: string
  status: string
  reference?: string
  createdAt: string
}

export interface DoctorPayout {
  id: string
  doctorId: string
  doctorName: string
  amount: number
  currency: string
  status: PayoutStatus
  payoutMethod: string
  providerReference?: string
  requestedAt: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

export interface DoctorEarningsSummary {
  doctorId: string
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  paidOut: number
  completedConsultationsCount: number
}

export interface FinancialInvoice {
  id: string
  invoiceType: 'PATIENT_RECEIPT' | 'DOCTOR_STATEMENT' | 'PLATFORM_SUMMARY'
  referenceId: string
  patientId?: string
  patientName?: string
  doctorId?: string
  doctorName?: string
  appointmentId?: string
  amount: number
  platformFee?: number
  doctorEarning?: number
  currency: string
  status: string
  createdAt: string
}
