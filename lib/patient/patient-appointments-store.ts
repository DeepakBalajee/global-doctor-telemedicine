import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'

export const patientAppointmentsStore = new Map<string, PatientAppointmentDetail>()


export async function getPatientAppointmentsFromDB(
  patientUserId: string,
  tab: string = 'upcoming'
): Promise<PatientAppointmentDetail[]> {
  try {
    const patRes = await db.query(`SELECT id FROM patients WHERE user_id = $1 LIMIT 1`, [patientUserId])
    if (patRes.rows.length === 0) return []
    const patientId = patRes.rows[0].id

    let statusCondition = "a.appointment_status IN ('CONFIRMED', 'REQUESTED')"
    if (tab === 'past') {
      statusCondition = "a.appointment_status = 'COMPLETED'"
    } else if (tab === 'cancelled') {
      statusCondition = "a.appointment_status = 'CANCELLED'"
    } else if (tab === 'all') {
      statusCondition = '1=1'
    }

    const query = `
      SELECT 
        a.id,
        a.consultation_request_id AS "consultationRequestId",
        a.patient_id AS "patientId",
        p.full_name AS "patientName",
        a.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        d.doctor_type AS "doctorType",
        d.specialty_name AS "specialtyName",
        a.consultation_type AS "consultationType",
        a.problem,
        a.appointment_date::text AS "appointmentDate",
        a.start_time AS "startTime",
        a.end_time AS "endTime",
        a.fee_inr::float AS "feeInINR",
        a.payment_status AS "paymentStatus",
        a.appointment_status AS "appointmentStatus",
        a.timeline,
        a.created_at AS "createdAt"
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = $1 AND ${statusCondition}
      ORDER BY a.appointment_date DESC, a.created_at DESC
    `

    const res = await db.query(query, [patientId])

    return (res.rows as any[]).map((row: any) => ({
      ...row,
      timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : row.timeline || [],
      isCancellable: row.appointmentStatus === 'CONFIRMED' || row.appointmentStatus === 'REQUESTED',
    }))
  } catch (err) {
    console.error('getPatientAppointmentsFromDB error:', err)
    return []
  }
}

export async function getDoctorAppointmentsFromDB(
  doctorUserId: string,
  tab: string = 'upcoming'
): Promise<PatientAppointmentDetail[]> {
  try {
    const docRes = await db.query(`SELECT id FROM doctors WHERE user_id = $1 LIMIT 1`, [doctorUserId])
    if (docRes.rows.length === 0) return []
    const doctorId = docRes.rows[0].id

    const todayStr = new Date().toISOString().split('T')[0]

    let statusCondition = "a.appointment_status IN ('CONFIRMED', 'REQUESTED')"
    if (tab === 'today') {
      statusCondition = `a.appointment_date = '${todayStr}' AND a.appointment_status IN ('CONFIRMED', 'REQUESTED')`
    } else if (tab === 'past') {
      statusCondition = "a.appointment_status = 'COMPLETED'"
    } else if (tab === 'cancelled') {
      statusCondition = "a.appointment_status = 'CANCELLED'"
    } else if (tab === 'all') {
      statusCondition = '1=1'
    }

    const query = `
      SELECT 
        a.id,
        a.consultation_request_id AS "consultationRequestId",
        a.patient_id AS "patientId",
        p.full_name AS "patientName",
        a.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        d.doctor_type AS "doctorType",
        d.specialty_name AS "specialtyName",
        a.consultation_type AS "consultationType",
        a.problem,
        a.appointment_date::text AS "appointmentDate",
        a.start_time AS "startTime",
        a.end_time AS "endTime",
        a.fee_inr::float AS "feeInINR",
        a.payment_status AS "paymentStatus",
        a.appointment_status AS "appointmentStatus",
        a.timeline,
        a.created_at AS "createdAt"
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.doctor_id = $1 AND ${statusCondition}
      ORDER BY a.appointment_date DESC, a.created_at DESC
    `

    const res = await db.query(query, [doctorId])

    return (res.rows as any[]).map((row: any) => ({
      ...row,
      timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : row.timeline || [],
      isCancellable: false,
    }))
  } catch (err) {
    console.error('getDoctorAppointmentsFromDB error:', err)
    return []
  }
}

export async function getAppointmentDetailFromDB(
  appointmentId: string
): Promise<PatientAppointmentDetail | null> {
  try {
    const res = await db.query(
      `
      SELECT 
        a.id,
        a.consultation_request_id AS "consultationRequestId",
        a.patient_id AS "patientId",
        p.full_name AS "patientName",
        a.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        d.doctor_type AS "doctorType",
        d.specialty_name AS "specialtyName",
        a.consultation_type AS "consultationType",
        a.problem,
        a.appointment_date::text AS "appointmentDate",
        a.start_time AS "startTime",
        a.end_time AS "endTime",
        a.fee_inr::float AS "feeInINR",
        a.payment_status AS "paymentStatus",
        a.appointment_status AS "appointmentStatus",
        a.timeline,
        a.created_at AS "createdAt"
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.id = $1
      LIMIT 1
      `,
      [appointmentId]
    )

    if (res.rows.length === 0) return null

    const row = res.rows[0]
    return {
      ...row,
      timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : row.timeline || [],
      isCancellable: row.appointmentStatus === 'CONFIRMED' || row.appointmentStatus === 'REQUESTED',
    }
  } catch (err) {
    console.error('getAppointmentDetailFromDB error:', err)
    return null
  }
}

export async function cancelAppointmentInDB(
  appointmentId: string,
  actorRole: string,
  reason?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await db.query(
      `
      UPDATE appointments
      SET appointment_status = 'CANCELLED',
          cancellation_reason = $1,
          cancelled_by = $2
      WHERE id = $3 AND appointment_status IN ('CONFIRMED', 'REQUESTED')
      `,
      [reason || 'User cancelled appointment', actorRole, appointmentId]
    )

    if ((res.rowCount ?? 0) === 0) {
      return { success: false, message: 'Appointment not found or not eligible for cancellation.' }
    }

    return { success: true, message: 'Appointment cancelled successfully.' }
  } catch (err) {
    console.error('cancelAppointmentInDB error:', err)
    return { success: false, message: 'Failed to cancel appointment.' }
  }
}

export async function reserveSlotInDB(payload: {
  doctorId: string
  date: string
  startTime: string
  consultationType: string
  patientUserId: string
  problem?: string
}): Promise<{ success: boolean; consultationRequestId?: string; feeInINR?: number; error?: string }> {
  try {
    const patRes = await db.query(`SELECT id FROM patients WHERE user_id = $1 LIMIT 1`, [payload.patientUserId])
    if (patRes.rows.length === 0) {
      return { success: false, error: 'Patient profile not found. Please complete profile.' }
    }
    const patientId = patRes.rows[0].id

    // Check blocked dates
    const blockedRes = await db.query(
      `SELECT id FROM doctor_blocked_dates WHERE doctor_id = $1 AND blocked_date = $2 LIMIT 1`,
      [payload.doctorId, payload.date]
    )
    if (blockedRes.rows.length > 0) {
      return { success: false, error: 'Doctor is unavailable on the selected date.' }
    }

    // Check existing active appointment for same doctor, date, start_time
    const conflictRes = await db.query(
      `
      SELECT id FROM appointments
      WHERE doctor_id = $1 AND appointment_date = $2 AND start_time = $3 AND appointment_status != 'CANCELLED'
      LIMIT 1
      `,
      [payload.doctorId, payload.date, payload.startTime]
    )

    if (conflictRes.rows.length > 0) {
      return { success: false, error: 'This slot is no longer available. Please choose another time.' }
    }

    const feeInINR = 5.0
    const reqId = randomUUID()

    await db.query(
      `
      INSERT INTO consultation_requests (
        id, patient_id, doctor_id, consultation_type, problem, appointment_date, preferred_time, fee_inr, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING_PAYMENT')
      `,
      [reqId, patientId, payload.doctorId, payload.consultationType || 'ONLINE_VIDEO', payload.problem || 'General Consultation', payload.date, payload.startTime, feeInINR]
    )

    return { success: true, consultationRequestId: reqId, feeInINR }
  } catch (err) {
    console.error('reserveSlotInDB error:', err)
    return { success: false, error: 'Unable to reserve slot. Please try again.' }
  }
}
