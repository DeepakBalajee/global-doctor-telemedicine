export interface TimeSlot {
  id: string
  label: string
  period: 'MORNING' | 'AFTERNOON' | 'EVENING'
}

export const AVAILABLE_TIME_SLOTS: TimeSlot[] = [
  { id: '0900', label: '09:00 AM', period: 'MORNING' },
  { id: '0930', label: '09:30 AM', period: 'MORNING' },
  { id: '1000', label: '10:00 AM', period: 'MORNING' },
  { id: '1030', label: '10:30 AM', period: 'MORNING' },
  { id: '1100', label: '11:00 AM', period: 'MORNING' },
  { id: '1130', label: '11:30 AM', period: 'MORNING' },
  { id: '1400', label: '02:00 PM', period: 'AFTERNOON' },
  { id: '1430', label: '02:30 PM', period: 'AFTERNOON' },
  { id: '1500', label: '03:00 PM', period: 'AFTERNOON' },
  { id: '1530', label: '03:30 PM', period: 'AFTERNOON' },
  { id: '1600', label: '04:00 PM', period: 'AFTERNOON' },
  { id: '1630', label: '04:30 PM', period: 'AFTERNOON' },
  { id: '1700', label: '05:00 PM', period: 'EVENING' },
  { id: '1800', label: '06:00 PM', period: 'EVENING' },
  { id: '1900', label: '07:00 PM', period: 'EVENING' },
]
