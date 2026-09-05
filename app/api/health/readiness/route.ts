import { NextResponse } from 'next/server'
import { checkReadinessStatus } from '@/lib/infrastructure/health-checker'

export async function GET() {
  const readiness = await checkReadinessStatus()
  const statusCode = readiness.status === 'READY' ? 200 : 503
  return NextResponse.json(readiness, { status: statusCode })
}
