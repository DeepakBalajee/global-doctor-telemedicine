import { UserRole } from './auth'

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'URGENT'

export type NotificationType =
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_COMPLETED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REFUNDED'
  | 'PAYOUT_COMPLETED'
  | 'PAYOUT_FAILED'
  | 'PRESCRIPTION_CREATED'
  | 'MEDICAL_RECORD_UPDATED'
  | 'MESSAGE_RECEIVED'
  | 'DOCTOR_VERIFICATION_PENDING'
  | 'DOCTOR_APPROVED'
  | 'DOCTOR_REJECTED'
  | 'DOCTOR_SUSPENDED'
  | 'ACCOUNT_ACTIVATED'
  | 'ACCOUNT_SUSPENDED'
  | 'ADMIN_CREATED'
  | 'SECURITY_ALERT'
  | 'SYSTEM_ALERT'

export interface NotificationItem {
  id: string
  recipientUserId: string
  recipientRole: UserRole
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  isRead: boolean
  createdAt: string
  readAt?: string
  deepLink?: string
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  userId?: string
  inAppEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  appointmentReminders: boolean
  paymentUpdates: boolean
  chatNotifications: boolean
  medicalUpdates: boolean
  securityAlerts: boolean
}

export interface TypingStatus {
  appointmentId: string
  userId: string
  userName: string
  isTyping: boolean
  updatedAt: string
}
