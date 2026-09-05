import { ConsultationSession, ConsultationMessage } from '@/types/consultation'
import { UserRole } from '@/types/auth'
import { db } from '@/lib/db'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { randomUUID } from 'crypto'

export async function getConsultationSessionByAppointmentId(
  appointmentId: string,
  userId?: string
): Promise<ConsultationSession | null> {
  try {
    const res = await db.query(
      `
      SELECT 
        cs.id,
        cs.appointment_id AS "appointmentId",
        cs.patient_id AS "patientId",
        p.full_name AS "patientName",
        cs.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        d.specialty_name AS "specialtyName",
        cs.consultation_type AS "consultationType",
        cs.status,
        cs.started_at AS "startedAt",
        cs.ended_at AS "endedAt",
        cs.duration_minutes AS "durationMinutes",
        cs.created_at AS "createdAt",
        cs.updated_at AS "updatedAt"
      FROM consultation_sessions cs
      JOIN patients p ON p.id = cs.patient_id
      JOIN doctors d ON d.id = cs.doctor_id
      WHERE cs.appointment_id = $1 OR cs.id = $1
      LIMIT 1
      `,
      [appointmentId]
    )

    if (res.rows.length === 0) {
      const appRes = await db.query(
        `
        SELECT 
          a.id AS "appointmentId",
          a.patient_id AS "patientId",
          p.full_name AS "patientName",
          a.doctor_id AS "doctorId",
          d.full_name AS "doctorName",
          d.specialty_name AS "specialtyName",
          a.consultation_type AS "consultationType"
        FROM appointments a
        JOIN patients p ON p.id = a.patient_id
        JOIN doctors d ON d.id = a.doctor_id
        WHERE a.id = $1
        LIMIT 1
        `,
        [appointmentId]
      )

      if (appRes.rows.length === 0) return null

      const appRow = appRes.rows[0]
      const sessionId = randomUUID()

      await db.query(
        `
        INSERT INTO consultation_sessions (
          id, appointment_id, patient_id, doctor_id, consultation_type, status
        )
        VALUES ($1, $2, $3, $4, $5, 'SCHEDULED')
        ON CONFLICT (appointment_id) DO NOTHING
        `,
        [sessionId, appRow.appointmentId, appRow.patientId, appRow.doctorId, appRow.consultationType]
      )

      return getConsultationSessionByAppointmentId(appointmentId, userId)
    }

    return res.rows[0]
  } catch (err) {
    console.error('getConsultationSessionByAppointmentId error:', err)
    return null
  }
}

export async function getConsultationMessages(
  sessionId: string
): Promise<ConsultationMessage[]> {
  try {
    const res = await db.query(
      `
      SELECT 
        id,
        consultation_session_id AS "consultationSessionId",
        sender_id AS "senderId",
        sender_name AS "senderName",
        sender_role AS "senderRole",
        message,
        created_at AS "createdAt"
      FROM consultation_messages
      WHERE consultation_session_id = $1
      ORDER BY created_at ASC
      `,
      [sessionId]
    )
    return res.rows
  } catch (err) {
    console.error('getConsultationMessages error:', err)
    return []
  }
}

export async function sendConsultationMessage(payload: {
  sessionId: string
  senderUserId: string
  senderName: string
  senderRole: UserRole
  message: string
}): Promise<{ success: boolean; messageItem?: ConsultationMessage; error?: string }> {
  try {
    const msgId = randomUUID()
    const now = new Date().toISOString()

    await db.query(
      `
      INSERT INTO consultation_messages (
        id, consultation_session_id, sender_id, sender_name, sender_role, message, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [msgId, payload.sessionId, payload.senderUserId, payload.senderName, payload.senderRole, payload.message, now]
    )

    const messageItem: ConsultationMessage = {
      id: msgId,
      consultationSessionId: payload.sessionId,
      senderId: payload.senderUserId,
      senderName: payload.senderName,
      senderRole: payload.senderRole,
      message: payload.message,
      createdAt: now,
    }

    return { success: true, messageItem }
  } catch (err) {
    console.error('sendConsultationMessage error:', err)
    return { success: false, error: 'Failed to send message.' }
  }
}

export async function updateConsultationSessionStatus(
  sessionId: string,
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED',
  actorRole: UserRole
): Promise<{ success: boolean; session?: ConsultationSession; error?: string }> {
  try {
    const isCompleted = status === 'COMPLETED'
    const endedAt = isCompleted ? new Date().toISOString() : null

    await db.query(
      `
      UPDATE consultation_sessions
      SET status = $1,
          started_at = COALESCE(started_at, NOW()),
          ended_at = COALESCE($2, ended_at),
          updated_at = NOW()
      WHERE id = $3 OR appointment_id = $3
      `,
      [status, endedAt, sessionId]
    )

    if (isCompleted) {
      await db.query(
        `
        UPDATE appointments
        SET appointment_status = 'COMPLETED'
        WHERE id IN (SELECT appointment_id FROM consultation_sessions WHERE id = $1 OR appointment_id = $1)
        `,
        [sessionId]
      )
    }

    const updated = await getConsultationSessionByAppointmentId(sessionId)
    return { success: true, session: updated || undefined }
  } catch (err) {
    console.error('updateConsultationSessionStatus error:', err)
    return { success: false, error: 'Failed to update consultation session status.' }
  }
}

export async function getOrCreateConsultationSession(
  appointmentId: string,
  userId?: string
): Promise<ConsultationSession | null> {
  return getConsultationSessionByAppointmentId(appointmentId, userId)
}

export async function startConsultationSession(
  appointmentId: string,
  actorRole: UserRole = UserRole.DOCTOR
): Promise<{ success: boolean; session?: ConsultationSession; error?: string }> {
  return updateConsultationSessionStatus(appointmentId, 'ACTIVE', actorRole)
}

interface TypingStatusInfo {
  isTyping: boolean
  userId?: string
  userName?: string
}

const typingMap = new Map<string, TypingStatusInfo>()

export function getTypingStatus(sessionId: string, userId?: string): { isTyping: boolean; userName?: string } | null {
  const info = typingMap.get(sessionId)
  if (!info || !info.isTyping) return null
  if (userId && info.userId === userId) return null
  return { isTyping: true, userName: info.userName }
}

export function setTypingStatus(
  sessionId: string,
  userId: string,
  userName: string,
  isTyping: boolean
): { isTyping: boolean } {
  typingMap.set(sessionId, { isTyping, userId, userName })
  return { isTyping }
}


export async function addConsultationMessage(payload: {
  sessionId: string
  senderUserId: string
  senderName: string
  senderRole: UserRole
  message: string
}): Promise<{ success: boolean; messageItem?: ConsultationMessage; error?: string }> {
  return sendConsultationMessage(payload)
}

export async function endConsultationSession(
  appointmentId: string,
  actorRole: UserRole = UserRole.DOCTOR
): Promise<{ success: boolean; session?: ConsultationSession; error?: string }> {
  return updateConsultationSessionStatus(appointmentId, 'COMPLETED', actorRole)
}


