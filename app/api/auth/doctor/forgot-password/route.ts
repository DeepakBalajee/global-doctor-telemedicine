import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Generic response to prevent account enumeration
    return NextResponse.json(
      {
        success: true,
        message: 'If your email address is registered, password reset instructions have been sent to your inbox.',
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to process reset request. Please try again.' },
      { status: 500 }
    )
  }
}
