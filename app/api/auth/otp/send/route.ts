import { NextResponse } from 'next/server'
import { otpService } from '@/lib/auth/otp-service'
import { ensureDatabaseSeeded } from '@/lib/db/seed-db'

export async function POST(request: Request) {
  await ensureDatabaseSeeded()

  try {
    const body = await request.json()
    const { mobileNumber, role } = body

    if (!mobileNumber?.trim()) {
      return NextResponse.json({ error: 'Mobile number is required.' }, { status: 400 })
    }

    const result = await otpService.sendPhoneOTP({ mobileNumber, role })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('OTP Send Error:', error)
    return NextResponse.json({ error: 'Failed to send OTP code.' }, { status: 500 })
  }
}
