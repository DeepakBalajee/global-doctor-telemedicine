import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  // Delegated to admin doctors API for master platform oversight
  const response = await fetch('http://localhost:3000/api/admin/doctors', { cache: 'no-store' }).catch(() => null)
  if (response && response.ok) {
    const list = await response.json()
    return NextResponse.json(list, { status: 200 })
  }

  return NextResponse.json([], { status: 200 })
}
