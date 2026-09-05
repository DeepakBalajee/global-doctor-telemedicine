import { ConsultationType } from './patient'

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type SlotDuration = 15 | 30 | 45 | 60

export interface TimeBreak {
  startTime: string // HH:MM
  endTime: string   // HH:MM
}

export interface WeeklyAvailabilitySlot {
  id: string
  day: DayOfWeek
  startTime: string // HH:MM (e.g., '09:00')
  endTime: string   // HH:MM (e.g., '17:00')
  consultationType: ConsultationType
  slotDuration: SlotDuration
  break?: TimeBreak
  isAvailable: boolean
}

export interface BlockedDateRange {
  id: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  reason?: string
}

export interface DateOverride {
  id: string
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  consultationType: ConsultationType
  slotDuration: SlotDuration
}

export interface DoctorAvailabilityConfig {
  doctorId: string
  weeklySlots: WeeklyAvailabilitySlot[]
  blockedDates: BlockedDateRange[]
  dateOverrides: DateOverride[]
}

export interface GeneratedAppointmentSlot {
  slotId: string
  doctorId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:MM AM/PM formatted
  endTime: string   // HH:MM AM/PM formatted
  rawStartTime: string // 24hr HH:MM for sorting
  consultationType: ConsultationType
  isAvailable: boolean
  isReserved?: boolean
  reason?: string
}
