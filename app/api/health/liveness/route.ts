import { NextResponse } from 'next/server'
import { checkLivenessStatus } from '@/lib/infrastructure/health-checker'

export async function GET() {
  const liveness = checkLivenessStatus()
  return NextResponse.json(liveness, { status: 200 })
}
