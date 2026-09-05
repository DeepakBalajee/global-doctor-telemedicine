import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { startDate, endDate, reason } = body

    if (!startDate || !endDate || startDate > endDate) {
      return NextResponse.json(
        { error: 'Invalid date range. Start date must be before end date.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Vacation blocked date saved successfully.',
        blockedRange: {
          id: 'BLK-' + Math.random().toString(36).substring(2, 7),
          startDate,
          endDate,
          reason,
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to add blocked date.' }, { status: 500 })
  }
}
