import { NextResponse } from 'next/server'
import { getPublicSettings } from '@/lib/admin/settings-store'

export async function GET() {
  const publicSettings = getPublicSettings()
  return NextResponse.json(publicSettings, { status: 200 })
}
