import { Prescription } from '@/types/prescription'
import { UserRole } from '@/types/auth'
import { db } from '@/lib/db'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { createNotification } from '@/lib/notifications/notification-store'
import { randomUUID } from 'crypto'

export async function getPrescriptionsForUser(
  userId: string,
  role: UserRole
): Promise<Prescription[]> {
  try {
    let whereClause = '1=1'
    let paramVal: string | null = null

    if (role === UserRole.PATIENT) {
      const patRes = await db.query(`SELECT id FROM patients WHERE user_id = $1 LIMIT 1`, [userId])
      if (patRes.rows.length === 0) return []
      whereClause = 'pr.patient_id = $1'
      paramVal = patRes.rows[0].id
    } else if (role === UserRole.DOCTOR) {
      const docRes = await db.query(`SELECT id FROM doctors WHERE user_id = $1 LIMIT 1`, [userId])
      if (docRes.rows.length === 0) return []
      whereClause = 'pr.doctor_id = $1'
      paramVal = docRes.rows[0].id
    }

    const query = `
      SELECT 
        pr.id,
        pr.appointment_id AS "appointmentId",
        pr.consultation_session_id AS "consultationSessionId",
        pr.patient_id AS "patientId",
        p.full_name AS "patientName",
        pr.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        d.specialty_name AS "doctorSpecialty",
        pr.diagnosis,
        pr.clinical_notes AS "clinicalNotes",
        pr.status,
        pr.issued_at AS "issuedAt",
        pr.created_at AS "createdAt",
        pr.updated_at AS "updatedAt"
      FROM prescriptions pr
      JOIN patients p ON p.id = pr.patient_id
      JOIN doctors d ON d.id = pr.doctor_id
      WHERE ${whereClause}
      ORDER BY pr.created_at DESC
    `

    const res = paramVal ? await db.query(query, [paramVal]) : await db.query(query)

    const prescriptions: Prescription[] = []

    for (const row of res.rows) {
      const medsRes = await db.query(
        `
        SELECT 
          id,
          medicine_name AS "medicineName",
          dosage,
          frequency,
          duration,
          instructions
        FROM prescription_medications
        WHERE prescription_id = $1
        `,
        [row.id]
      )

      prescriptions.push({
        ...row,
        medications: medsRes.rows,
      })
    }

    return prescriptions
  } catch (err) {
    console.error('getPrescriptionsForUser error:', err)
    return []
  }
}

export async function getPrescriptionDetail(
  prescriptionId: string
): Promise<Prescription | null> {
  try {
    const res = await db.query(
      `
      SELECT 
        pr.id,
        pr.appointment_id AS "appointmentId",
        pr.consultation_session_id AS "consultationSessionId",
        pr.patient_id AS "patientId",
        p.full_name AS "patientName",
        pr.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        d.specialty_name AS "doctorSpecialty",
        pr.diagnosis,
        pr.clinical_notes AS "clinicalNotes",
        pr.status,
        pr.issued_at AS "issuedAt",
        pr.created_at AS "createdAt",
        pr.updated_at AS "updatedAt"
      FROM prescriptions pr
      JOIN patients p ON p.id = pr.patient_id
      JOIN doctors d ON d.id = pr.doctor_id
      WHERE pr.id = $1
      LIMIT 1
      `,
      [prescriptionId]
    )

    if (res.rows.length === 0) return null

    const row = res.rows[0]
    const medsRes = await db.query(
      `
      SELECT 
        id,
        medicine_name AS "medicineName",
        dosage,
        frequency,
        duration,
        instructions
      FROM prescription_medications
      WHERE prescription_id = $1
      `,
      [row.id]
    )

    return {
      ...row,
      medications: medsRes.rows,
    }
  } catch (err) {
    console.error('getPrescriptionDetail error:', err)
    return null
  }
}

export async function createOrUpdatePrescription(
  payload: Partial<Prescription> & { doctorUserId: string }
): Promise<{ success: boolean; prescription?: Prescription; error?: string }> {
  try {
    const docRes = await db.query(`SELECT id, full_name, specialty_name FROM doctors WHERE user_id = $1 LIMIT 1`, [payload.doctorUserId])
    if (docRes.rows.length === 0) {
      return { success: false, error: 'Doctor account not found.' }
    }
    const doctor = docRes.rows[0]

    let appointmentId = payload.appointmentId
    let patientId = payload.patientId

    if (!appointmentId || !patientId) {
      const appRes = await db.query(`SELECT id, patient_id FROM appointments WHERE doctor_id = $1 LIMIT 1`, [doctor.id])
      if (appRes.rows.length === 0) {
        return { success: false, error: 'No active appointment found for prescription creation.' }
      }
      appointmentId = appointmentId || appRes.rows[0].id
      patientId = patientId || appRes.rows[0].patient_id
    }

    const prescriptionId = payload.id || randomUUID()
    const isIssued = payload.status === 'ISSUED'
    const issuedAt = isIssued ? new Date().toISOString() : null

    const client = await db.connect()
    try {
      await client.query('BEGIN')

      await client.query(
        `
        INSERT INTO prescriptions (
          id, appointment_id, consultation_session_id, patient_id, doctor_id, diagnosis, clinical_notes, status, issued_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE
        SET diagnosis = EXCLUDED.diagnosis,
            clinical_notes = EXCLUDED.clinical_notes,
            status = EXCLUDED.status,
            issued_at = COALESCE(prescriptions.issued_at, EXCLUDED.issued_at),
            updated_at = NOW()
        `,
        [
          prescriptionId,
          appointmentId,
          payload.consultationSessionId || null,
          patientId,
          doctor.id,
          payload.diagnosis || 'Clinical Diagnosis',
          payload.clinicalNotes || '',
          payload.status || 'DRAFT',
          issuedAt,
        ]
      )

      if (payload.medications && Array.isArray(payload.medications)) {
        await client.query(`DELETE FROM prescription_medications WHERE prescription_id = $1`, [prescriptionId])
        for (const med of payload.medications) {
          await client.query(
            `
            INSERT INTO prescription_medications (
              id, prescription_id, medicine_name, dosage, frequency, duration, instructions
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
            [
              randomUUID(),
              prescriptionId,
              med.medicineName || 'Medicine',
              med.dosage || '1 Tablet',
              med.frequency || 'Once daily',
              med.duration || '7 days',
              med.instructions || '',
            ]
          )
        }
      }

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

    logAuditEvent({
      actorUserId: payload.doctorUserId,
      actorRole: UserRole.DOCTOR,
      action: isIssued ? 'PRESCRIPTION_ISSUED' : 'PRESCRIPTION_DRAFTED',
      targetType: 'PRESCRIPTION',
      targetId: prescriptionId,
      details: `Doctor issued prescription for appointment ${appointmentId}`,
      success: true,
    })

    if (isIssued && patientId) {
      const patUserRes = await db.query(`SELECT user_id FROM patients WHERE id = $1 LIMIT 1`, [patientId])
      if (patUserRes.rows.length > 0) {
        createNotification({
          recipientUserId: patUserRes.rows[0].user_id,
          recipientRole: UserRole.PATIENT,
          type: 'PRESCRIPTION_CREATED',
          title: 'Prescription Issued',
          message: `Dr. ${doctor.full_name} issued a new prescription for your consultation.`,
          priority: 'NORMAL',
          deepLink: `/patient/prescriptions/${prescriptionId}`,
        }).catch(() => {})
      }
    }

    const result = await getPrescriptionDetail(prescriptionId)
    return { success: true, prescription: result || undefined }
  } catch (err) {
    console.error('createOrUpdatePrescription error:', err)
    return { success: false, error: 'Failed to save prescription.' }
  }
}

export async function getPrescriptionById(
  prescriptionId: string
): Promise<Prescription | null> {
  return getPrescriptionDetail(prescriptionId)
}

export async function createPrescription(
  payload: Partial<Prescription> & { doctorUserId: string }
): Promise<{ success: boolean; prescription?: Prescription; error?: string }> {
  return createOrUpdatePrescription(payload)
}

export async function revokePrescription(
  prescriptionId: string,
  actorUserId: string = 'USR-SA-001'
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.query(`UPDATE prescriptions SET status = 'REVOKED', updated_at = NOW() WHERE id = $1`, [prescriptionId])
    logAuditEvent({
      actorUserId,
      actorRole: UserRole.SUPER_ADMIN,
      action: 'PRESCRIPTION_REVOKED',
      targetType: 'PRESCRIPTION',
      targetId: prescriptionId,
      details: `Revoked prescription ${prescriptionId}`,
      success: true,
    })
    return { success: true }
  } catch (err) {
    console.error('revokePrescription error:', err)
    return { success: false, error: 'Failed to revoke prescription.' }
  }
}

