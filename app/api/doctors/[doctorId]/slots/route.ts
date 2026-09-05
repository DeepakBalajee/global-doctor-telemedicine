import { NextResponse } from 'next/server'
import { GeneratedAppointmentSlot, DayOfWeek } from '@/types/availability'

// Helper: Convert 24hr string HH:MM to 12hr AM/PM
function format12Hour(time24: string): string {
  const [hStr, mStr] = time24.split(':')
  let h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const period = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`
}

// Helper: Add minutes to HH:MM 24hr string
function addMinutes(time24: string, mins: number): string {
  const [hStr, mStr] = time24.split(':')
  let h = parseInt(hStr, 10)
  let m = parseInt(mStr, 10) + mins
  while (m >= 60) {
    m -= 60
    h += 1
  }
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export async function GET(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  const { doctorId } = params
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!date) {
    return NextResponse.json({ error: 'Date parameter (YYYY-MM-DD) is required.' }, { status: 400 })
  }

  // Parse day of week
  const dateObj = new Date(date)
  const dayNames: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const dayOfWeek = dayNames[dateObj.getUTCDay()]

  // Sunday demo non-working day check
  if (dayOfWeek === 'SUNDAY') {
    return NextResponse.json([], { status: 200 })
  }

  // Simulated working hours generation (09:00 to 17:00 with 30 min duration & 13:00-14:00 break)
  const slots: GeneratedAppointmentSlot[] = []
  const startHour = 9
  const endHour = 17
  const duration = 30
  const breakStart = '13:00'
  const breakEnd = '14:00'

  // Simulated booked slot (10:30 AM already booked for demonstration)
  const bookedTimes = ['10:30']

  let current24 = `${startHour.toString().padStart(2, '0')}:00`
  const end24 = `${endHour.toString().padStart(2, '0')}:00`

  while (current24 < end24) {
    const next24 = addMinutes(current24, duration)
    
    // Check if slot falls in break
    const isBreak = current24 >= breakStart && current24 < breakEnd

    if (!isBreak) {
      const isBooked = bookedTimes.includes(current24)
      slots.push({
        slotId: `SLOT-${doctorId}-${date}-${current24}`,
        doctorId,
        date,
        startTime: format12Hour(current24),
        endTime: format12Hour(next24),
        rawStartTime: current24,
        consultationType: 'ONLINE_VIDEO',
        isAvailable: !isBooked,
        reason: isBooked ? 'Already Booked' : undefined,
      })
    }

    current24 = next24
  }

  return NextResponse.json(slots, { status: 200 })
}
