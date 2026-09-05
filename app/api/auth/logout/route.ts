import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revokeDBSession } from '@/lib/auth/session'

export async function POST() {
  const cookieStore = cookies()

  const patToken = cookieStore.get('telemed_patient_session')?.value
  const docToken = cookieStore.get('telemed_doc_session')?.value
  const admToken = cookieStore.get('telemed_admin_session')?.value
  const saToken = cookieStore.get('telemed_super_admin_session')?.value

  const token = patToken || docToken || admToken || saToken

  if (token) {
    await revokeDBSession(token)
  }

  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully.' },
    { status: 200 }
  )

  response.cookies.delete('telemed_patient_session')
  response.cookies.delete('telemed_doc_session')
  response.cookies.delete('telemed_admin_session')
  response.cookies.delete('telemed_super_admin_session')

  return response
}
