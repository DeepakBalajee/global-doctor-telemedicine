import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { validateDBSession } from '@/lib/auth/session'
import { PatientDashboardData } from '@/types/patient-auth'

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_patient_session')

  if (!sessionToken?.value) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
  }

  const session = await validateDBSession(sessionToken.value)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 })
  }

  try {
    const patientRes = await db.query(
      `
      SELECT 
        p.id AS patient_id,
        p.user_id,
        p.full_name,
        p.mobile_number,
        p.date_of_birth,
        p.gender,
        p.preferred_language,
        p.city_town_village,
        p.created_at,
        u.username,
        u.email,
        u.name AS user_name
      FROM users u
      LEFT JOIN patients p ON p.user_id = u.id
      WHERE u.id = $1
      LIMIT 1
      `,
      [session.userId]
    )

    let profile = {
      id: session.patientId || `PAT-${session.userId.substring(0, 6)}`,
      userId: session.userId,
      fullName: session.name || session.username || 'Patient',
      username: session.username,
      email: session.email,
      mobileNumber: '',
      dateOfBirth: '1995-01-01',
      age: 29,
      gender: 'PREFER_NOT_TO_SAY',
      preferredLanguage: 'EN',
      city: 'General Location',
      town: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (patientRes.rows.length > 0) {
      const row = patientRes.rows[0]
      const fullName = row.full_name || row.user_name || session.name || session.username || 'Patient'
      const locationParts = (row.city_town_village || '').split(',').map((s: string) => s.trim()).filter(Boolean)

      let age = 30
      if (row.date_of_birth) {
        const dob = new Date(row.date_of_birth)
        const diffMs = Date.now() - dob.getTime()
        const ageDate = new Date(diffMs)
        age = Math.abs(ageDate.getUTCFullYear() - 1970)
      }

      profile = {
        id: row.patient_id || session.patientId || `PAT-${session.userId.substring(0, 6)}`,
        userId: session.userId,
        fullName: fullName,
        username: row.username || session.username,
        email: row.email || session.email,
        mobileNumber: row.mobile_number || '',
        dateOfBirth: row.date_of_birth ? new Date(row.date_of_birth).toISOString().split('T')[0] : '1995-01-01',
        age: age,
        gender: row.gender || 'PREFER_NOT_TO_SAY',
        preferredLanguage: (row.preferred_language || 'en').toUpperCase(),
        city: locationParts[0] || 'General Location',
        town: locationParts[1] || '',
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    // Query patient appointments from PostgreSQL
    const appointmentsRes = await db.query(
      `
      SELECT 
        a.id,
        a.consultation_request_id,
        a.doctor_id,
        d.full_name AS doctor_name,
        d.type AS doctor_type,
        s.name AS specialty_name,
        a.consultation_type,
        a.problem,
        a.appointment_date,
        a.start_time,
        a.fee_inr,
        a.payment_status,
        a.appointment_status,
        a.created_at
      FROM appointments a
      LEFT JOIN doctors d ON d.id = a.doctor_id
      LEFT JOIN specialties s ON s.id = d.specialty_id
      WHERE a.patient_id = $1 OR a.patient_id = $2
      ORDER BY a.created_at DESC
      `,
      [profile.id, session.userId]
    )

    const appointments = appointmentsRes.rows.map((row: any) => ({
      id: row.id,
      consultationRequestId: row.consultation_request_id || '',
      doctorId: row.doctor_id || '',
      doctorName: row.doctor_name || 'Dr. Specialist',
      doctorType: row.doctor_type || 'SPECIALIST',
      specialtyName: row.specialty_name || 'General Medicine',
      consultationType: row.consultation_type || 'ONLINE_VIDEO',
      problem: row.problem || 'General Consultation',
      appointmentDate: row.appointment_date ? new Date(row.appointment_date).toISOString().split('T')[0] : '',
      preferredTime: row.start_time || '10:00 AM',
      feeInINR: parseFloat(row.fee_inr || '5.0'),
      paymentStatus: row.payment_status || 'PAID',
      appointmentStatus: row.appointment_status || 'CONFIRMED',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }))

    const dashboardData: PatientDashboardData = {
      profile: profile as any,
      appointments: appointments as any,
      totalConsultationsCount: appointments.length,
      paidConsultationsCount: appointments.filter((a: any) => a.paymentStatus === 'PAID').length,
    }

    return NextResponse.json(dashboardData, { status: 200 })
  } catch (error) {
    console.error('Patient dashboard fetch error:', error)
    return NextResponse.json({ error: 'Failed to load patient dashboard.' }, { status: 500 })
  }
}
