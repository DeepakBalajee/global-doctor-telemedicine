import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { checkReadinessStatus } from '@/lib/infrastructure/health-checker'
import { getEnvConfig } from '@/lib/config/env-config'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden. Super Admin privileges required.' }, { status: 403 })
  }

  const readiness = checkReadinessStatus()
  const config = getEnvConfig()

  return NextResponse.json({
    readiness,
    config: {
      nodeEnv: config.nodeEnv,
      appUrl: config.appUrl,
      apiBaseUrl: config.apiBaseUrl,
      isProduction: config.isProduction,
      hasDatabaseUrl: Boolean(config.databaseUrl),
      hasJwtSecret: Boolean(config.jwtSecret),
      hasRazorpaySecret: Boolean(config.razorpaySecret),
      hasVideoServiceKey: Boolean(config.videoServiceKey),
    },
  }, { status: 200 })
}
