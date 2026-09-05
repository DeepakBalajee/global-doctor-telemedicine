import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getPrescriptionById } from '@/lib/medical-records/prescription-store'

export async function GET(
  request: Request,
  { params }: { params: { prescriptionId: string } }
) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_doc_session')?.value ||
    cookieStore.get('telemed_patient_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { prescriptionId } = params
  const item = await getPrescriptionById(prescriptionId)

  if (!item) {
    return NextResponse.json({ error: 'Prescription not found or access denied.' }, { status: 404 })
  }

  // IDOR Protection: Verify ownership unless super admin / admin
  if (
    (session.role === 'PATIENT' && item.patientId !== session.patientId) ||
    (session.role === 'DOCTOR' && item.doctorId !== session.doctorId)
  ) {
    return NextResponse.json({ error: 'Forbidden. Access denied.' }, { status: 403 })
  }

  return NextResponse.json({ success: true, prescription: item }, { status: 200 })
}
