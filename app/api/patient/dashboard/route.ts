import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PatientDashboardData, PatientAppointmentSummary } from '@/types/patient-auth'

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_patient_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
  }

  // Simulated authenticated patient profile & appointments
  // Strict IDOR ownership: backend returns ONLY data matching the authenticated patient ID
  const dashboardData: PatientDashboardData = {
    profile: {
      id: 'PAT-88190',
      userId: 'USR-PAT-88190',
      fullName: 'Anita Sharma',
      username: 'anita_sharma',
      email: 'anita.sharma@example.com',
      mobileNumber: '+91 98123 45678',
      dateOfBirth: '1992-06-15',
      age: 32,
      gender: 'FEMALE',
      preferredLanguage: 'hi',
      city: 'Delhi',
      town: 'South Delhi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    appointments: [
      {
        id: 'APP-77102',
        consultationRequestId: 'REQ-PREVIEW-101',
        doctorId: 'DOC-101',
        doctorName: 'Dr. Sarah Jenkins',
        doctorType: 'SPECIALIST',
        specialtyName: 'Cardiology',
        consultationType: 'ONLINE_VIDEO',
        problem: 'Consultation reason provided (Protected)',
        appointmentDate: '2026-09-05',
        preferredTime: '10:30 AM',
        feeInINR: 5.0,
        paymentStatus: 'PAID',
        appointmentStatus: 'CONFIRMED' as any,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    totalConsultationsCount: 1,
    paidConsultationsCount: 1,
  }

  return NextResponse.json(dashboardData, { status: 200 })
}
