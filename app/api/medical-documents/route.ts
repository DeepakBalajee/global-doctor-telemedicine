import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateDBSession } from '@/lib/auth/session'
import { getMedicalDocumentsForUser, uploadMedicalDocument } from '@/lib/medical-records/document-store'

export async function GET() {
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

  const documents = await getMedicalDocumentsForUser(session.userId, session.role)
  return NextResponse.json({ documents }, { status: 200 })
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_doc_session')?.value ||
    cookieStore.get('telemed_patient_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = await validateDBSession(token)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await uploadMedicalDocument({
      fileName: body.fileName || 'medical_record.pdf',
      fileSize: body.fileSize || 102400,
      mimeType: body.mimeType || 'application/pdf',
      documentType: body.documentType || 'GENERAL_RECORD',
      patientUserId: session.userId,
      uploaderRole: session.role,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Upload failed.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, document: result.document }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid file upload payload.' }, { status: 400 })
  }
}
