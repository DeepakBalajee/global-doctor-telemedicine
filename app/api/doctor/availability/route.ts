import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DoctorAvailabilityConfig, WeeklyAvailabilitySlot } from '@/types/availability'

// In-memory availability store
const availabilityStore = new Map<string, DoctorAvailabilityConfig>()

// Default availability config for demo doctor DOC-101
const defaultDoc101Config: DoctorAvailabilityConfig = {
  doctorId: 'DOC-101',
  weeklySlots: [
    {
      id: 'SLOT-1',
      day: 'MONDAY',
      startTime: '09:00',
      endTime: '17:00',
      consultationType: 'ONLINE_VIDEO',
      slotDuration: 30,
      break: { startTime: '13:00', endTime: '14:00' },
      isAvailable: true,
    },
    {
      id: 'SLOT-2',
      day: 'TUESDAY',
      startTime: '09:00',
      endTime: '17:00',
      consultationType: 'ONLINE_VIDEO',
      slotDuration: 30,
      break: { startTime: '13:00', endTime: '14:00' },
      isAvailable: true,
    },
    {
      id: 'SLOT-3',
      day: 'WEDNESDAY',
      startTime: '09:00',
      endTime: '17:00',
      consultationType: 'ONLINE_VIDEO',
      slotDuration: 30,
      break: { startTime: '13:00', endTime: '14:00' },
      isAvailable: true,
    },
    {
      id: 'SLOT-4',
      day: 'THURSDAY',
      startTime: '09:00',
      endTime: '17:00',
      consultationType: 'ONLINE_VIDEO',
      slotDuration: 30,
      break: { startTime: '13:00', endTime: '14:00' },
      isAvailable: true,
    },
    {
      id: 'SLOT-5',
      day: 'FRIDAY',
      startTime: '09:00',
      endTime: '17:00',
      consultationType: 'ONLINE_VIDEO',
      slotDuration: 30,
      break: { startTime: '13:00', endTime: '14:00' },
      isAvailable: true,
    },
    {
      id: 'SLOT-6',
      day: 'SATURDAY',
      startTime: '10:00',
      endTime: '14:00',
      consultationType: 'ONLINE_AUDIO',
      slotDuration: 30,
      isAvailable: true,
    },
  ],
  blockedDates: [],
  dateOverrides: [],
}

availabilityStore.set('DOC-101', defaultDoc101Config)

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const config = availabilityStore.get('DOC-101') || defaultDoc101Config
  return NextResponse.json(config, { status: 200 })
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { weeklySlots }: { weeklySlots: WeeklyAvailabilitySlot[] } = body

    // Server-side schedule validation
    for (const slot of weeklySlots) {
      if (slot.startTime >= slot.endTime) {
        return NextResponse.json(
          { error: `Invalid schedule for ${slot.day}: Start time must be before end time.` },
          { status: 400 }
        )
      }

      if (slot.break) {
        if (slot.break.startTime < slot.startTime || slot.break.endTime > slot.endTime || slot.break.startTime >= slot.break.endTime) {
          return NextResponse.json(
            { error: `Invalid break range for ${slot.day}: Break must be within working hours.` },
            { status: 400 }
          )
        }
      }
    }

    const currentConfig = availabilityStore.get('DOC-101') || defaultDoc101Config
    currentConfig.weeklySlots = weeklySlots
    availabilityStore.set('DOC-101', currentConfig)

    return NextResponse.json({ success: true, config: currentConfig }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Failed to update schedule.' }, { status: 500 })
  }
}
