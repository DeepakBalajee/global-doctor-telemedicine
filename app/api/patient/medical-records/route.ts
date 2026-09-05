import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/types/auth'
import { getPrescriptionsForUser } from '@/lib/medical-records/prescription-store'
import { getMedicalDocumentsForUser } from '@/lib/medical-records/document-store'

export async function GET() {
  const cookieStore = cookies()
  const patientCookie = cookieStore.get('telemed_patient_session')
  const docCookie = cookieStore.get('telemed_doc_session')

  let activeUserId = ''
  let activeRole = UserRole.PATIENT

  if (patientCookie) {
    activeUserId = 'USR-PAT-88190'
    activeRole = UserRole.PATIENT
  } else if (docCookie) {
    activeUserId = 'USR-DOC-101'
    activeRole = UserRole.DOCTOR
  } else {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const prescriptions = getPrescriptionsForUser(activeUserId, activeRole)
  const documents = getMedicalDocumentsForUser(activeUserId, activeRole)

  return NextResponse.json({ prescriptions, documents }, { status: 200 })
}
