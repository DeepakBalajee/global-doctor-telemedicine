import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { validateDBSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { patientDetails, consultationType, appointmentDate, preferredTime, doctorId, specialtyId } = payload

    if (
      !patientDetails?.fullName?.trim() ||
      !patientDetails?.dateOfBirth ||
      !patientDetails?.gender ||
      !patientDetails?.problem?.trim() ||
      !patientDetails?.preferredLanguage ||
      !patientDetails?.cityTownVillage?.trim() ||
      !consultationType ||
      !appointmentDate ||
      !preferredTime
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required fields marked with an asterisk (*).' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const sessionToken = cookieStore.get('telemed_patient_session')
    let session = sessionToken?.value ? await validateDBSession(sessionToken.value) : null

    const client = await db.connect()

    try {
      let resolvedPatientId: string
      let resolvedUserId: string

      if (session?.patientId) {
        resolvedPatientId = session.patientId
        resolvedUserId = session.userId
      } else {
        // Find existing patient or create guest patient record in PostgreSQL
        const searchPat = await client.query(
          `SELECT p.id, p.user_id FROM patients p JOIN users u ON u.id = p.user_id WHERE LOWER(p.full_name) = LOWER($1) LIMIT 1`,
          [patientDetails.fullName.trim()]
        )

        if (searchPat.rows.length > 0) {
          resolvedPatientId = searchPat.rows[0].id
          resolvedUserId = searchPat.rows[0].user_id
        } else {
          // Fallback to first patient or insert guest user & patient in PostgreSQL
          const firstPat = await client.query(`SELECT id, user_id FROM patients LIMIT 1`)
          if (firstPat.rows.length > 0) {
            resolvedPatientId = firstPat.rows[0].id
            resolvedUserId = firstPat.rows[0].user_id
          } else {
            resolvedUserId = randomUUID()
            resolvedPatientId = randomUUID()
            await client.query(
              `INSERT INTO users (id, username, email, password_hash, role, name, is_active) VALUES ($1, $2, $3, 'guest_hash', 'PATIENT', $4, true)`,
              [resolvedUserId, `patient_${Date.now()}`, `patient_${Date.now()}@telemed.org`, patientDetails.fullName.trim()]
            )
            await client.query(
              `INSERT INTO patients (id, user_id, full_name, mobile_number, date_of_birth, gender, problem, preferred_language, city_town_village) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                resolvedPatientId,
                resolvedUserId,
                patientDetails.fullName.trim(),
                patientDetails.mobileNumber || '+91 98000 00000',
                patientDetails.dateOfBirth,
                patientDetails.gender,
                patientDetails.problem.trim(),
                patientDetails.preferredLanguage,
                patientDetails.cityTownVillage.trim(),
              ]
            )
          }
        }
      }

      // Resolve Doctor ID if not passed
      let resolvedDoctorId = doctorId
      if (!resolvedDoctorId) {
        const docRes = await client.query(`SELECT id FROM doctors WHERE verification_status = 'APPROVED' OR verification_status = 'VERIFIED' LIMIT 1`)
        if (docRes.rows.length > 0) {
          resolvedDoctorId = docRes.rows[0].id
        } else {
          const anyDoc = await client.query(`SELECT id FROM doctors LIMIT 1`)
          resolvedDoctorId = anyDoc.rows[0]?.id
        }
      }

      const consultationRequestId = randomUUID()

      await client.query(
        `
        INSERT INTO consultation_requests (
          id,
          patient_id,
          doctor_id,
          specialty_id,
          consultation_type,
          problem,
          appointment_date,
          preferred_time,
          fee_inr,
          status,
          patient_details
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 5.0, 'PAYMENT_PENDING', $9)
        `,
        [
          consultationRequestId,
          resolvedPatientId,
          resolvedDoctorId || null,
          specialtyId || 'general-medicine',
          consultationType,
          patientDetails.problem.trim(),
          appointmentDate,
          preferredTime,
          JSON.stringify(patientDetails),
        ]
      )

      return NextResponse.json(
        {
          success: true,
          data: {
            id: consultationRequestId,
            consultationRequestId: consultationRequestId,
            payload,
            feeInINR: 5,
            status: 'PAYMENT_PENDING',
            createdAt: new Date().toISOString(),
          },
        },
        { status: 201 }
      )
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Consultation Request Creation Error:', error)
    return NextResponse.json(
      { error: 'Failed to create consultation request. Please try again.' },
      { status: 500 }
    )
  }
}
