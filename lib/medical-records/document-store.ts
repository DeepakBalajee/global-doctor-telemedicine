import { MedicalDocument, MedicalDocumentType } from '@/types/medical-record'
import { UserRole } from '@/types/auth'
import { db } from '@/lib/db'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { randomUUID } from 'crypto'

export async function getMedicalDocumentsForUser(
  userId: string,
  role: UserRole
): Promise<MedicalDocument[]> {
  try {
    let whereClause = '1=1'
    let paramVal: string | null = null

    if (role === UserRole.PATIENT) {
      const patRes = await db.query(`SELECT id FROM patients WHERE user_id = $1 LIMIT 1`, [userId])
      if (patRes.rows.length === 0) return []
      whereClause = 'md.patient_id = $1'
      paramVal = patRes.rows[0].id
    } else if (role === UserRole.DOCTOR) {
      const docRes = await db.query(`SELECT id FROM doctors WHERE user_id = $1 LIMIT 1`, [userId])
      if (docRes.rows.length === 0) return []
      whereClause = 'md.doctor_id = $1'
      paramVal = docRes.rows[0].id
    }

    const query = `
      SELECT 
        md.id,
        md.patient_id AS "patientId",
        p.full_name AS "patientName",
        md.uploaded_by AS "uploadedBy",
        md.document_type AS "documentType",
        md.file_name AS "fileName",
        md.storage_key AS "storageKey",
        md.mime_type AS "mimeType",
        md.file_size::bigint AS "fileSize",
        md.status,
        md.created_at AS "createdAt",
        md.updated_at AS "updatedAt"
      FROM medical_documents md
      JOIN patients p ON p.id = md.patient_id
      WHERE md.status = 'ACTIVE' AND ${whereClause}
      ORDER BY md.created_at DESC
    `

    const res = paramVal ? await db.query(query, [paramVal]) : await db.query(query)
    return res.rows
  } catch (err) {
    console.error('getMedicalDocumentsForUser error:', err)
    return []
  }
}

export function validateDocumentUpload(file: {
  fileName: string
  fileSize: number
  mimeType: string
}): { valid: boolean; error?: string } {
  const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.bin', '.js', '.vbs', '.msi']
  const LOWER_NAME = file.fileName.toLowerCase()

  if (BLOCKED_EXTENSIONS.some((ext) => LOWER_NAME.endsWith(ext))) {
    return {
      valid: false,
      error: 'Security Guard: Executable and script files (.exe, .sh, .bat, etc.) are strictly prohibited.',
    }
  }

  const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
  if (file.fileSize > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds maximum allowable limit of 10MB.',
    }
  }

  return { valid: true }
}

export async function uploadMedicalDocument(payload: {
  fileName: string
  fileSize: number
  mimeType: string
  documentType: MedicalDocumentType
  patientUserId: string
  uploaderRole: UserRole
}): Promise<{ success: boolean; document?: MedicalDocument; error?: string }> {
  const validation = validateDocumentUpload(payload)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  try {
    const patRes = await db.query(`SELECT id, full_name FROM patients WHERE user_id = $1 LIMIT 1`, [payload.patientUserId])
    if (patRes.rows.length === 0) {
      return { success: false, error: 'Patient account not found.' }
    }
    const patient = patRes.rows[0]
    const docId = randomUUID()
    const storageKey = `med_docs/${patient.id}/${Date.now()}_${payload.fileName}`

    await db.query(
      `
      INSERT INTO medical_documents (
        id, patient_id, uploaded_by, document_type, file_name, storage_key, mime_type, file_size, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE')
      `,
      [docId, patient.id, payload.uploaderRole, payload.documentType, payload.fileName, storageKey, payload.mimeType, payload.fileSize]
    )

    logAuditEvent({
      actorUserId: payload.patientUserId,
      actorRole: payload.uploaderRole,
      action: 'MEDICAL_DOCUMENT_UPLOADED',
      targetType: 'MEDICAL_DOCUMENT',
      targetId: docId,
      details: `Uploaded document: ${payload.fileName}`,
      success: true,
    })

    const doc: MedicalDocument = {
      id: docId,
      patientId: patient.id,
      patientName: patient.full_name,
      uploadedBy: payload.uploaderRole as any,
      documentType: payload.documentType,
      fileName: payload.fileName,
      storageKey,
      mimeType: payload.mimeType,
      fileSize: payload.fileSize,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return { success: true, document: doc }
  } catch (err) {
    console.error('uploadMedicalDocument error:', err)
    return { success: false, error: 'Failed to upload document.' }
  }
}
