import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPlatformSettings, updatePlatformSettings } from '@/lib/admin/settings-store'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const settings = getPlatformSettings()
  return NextResponse.json(settings, { status: 200 })
}

export async function PATCH(request: Request) {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const result = updatePlatformSettings(body, 'USR-SA-001')

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(
      { success: true, settings: result.settings, message: 'Platform settings updated successfully.' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ error: 'Failed to update platform settings.' }, { status: 500 })
  }
}
