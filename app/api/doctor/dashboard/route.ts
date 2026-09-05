import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DoctorDashboardData } from '@/types/doctor-dashboard'

export async function GET() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('telemed_doc_session')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
  }

  // Simulated verified doctor dashboard data
  // Strict IDOR ownership: returns ONLY appointments belonging to authenticated doctor DOC-101
  const dashboardData: DoctorDashboardData = {
    profile: {
      id: 'DOC-101',
      userId: 'USR-DOC-101',
      fullName: 'Dr. Sarah Jenkins',
      username: 'dr_jenkins',
      email: 'sarah.jenkins@globaltelemed.org',
      mobileNumber: '+91 98765 43210',
      doctorType: 'SPECIALIST',
      specialtyId: 'cardiology',
      specialtyName: 'Cardiology',
      medicalQualification: 'MD, FACC',
      experienceYears: 12,
      licenseNumber: 'MCI-889012',
      licensingAuthority: 'Medical Council of India',
      bio: 'Senior Cardiologist specializing in preventive heart health and non-invasive cardiovascular consultations.',
      languages: ['en', 'hi'],
      consultationModes: ['ONLINE_VIDEO', 'ONLINE_AUDIO'],
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      verificationStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    statistics: {
      todayAppointmentsCount: 1,
      upcomingAppointmentsCount: 2,
      completedConsultationsCount: 148,
      totalPatientsCount: 124,
    },
    upcomingAppointments: [
      {
        id: 'APP-77102',
        consultationRequestId: 'REQ-PREVIEW-101',
        patientId: 'PAT-88190',
        patientName: 'Anita Sharma',
        patientAge: 32,
        patientGender: 'FEMALE',
        consultationType: 'ONLINE_VIDEO',
        problem: 'Consultation reason provided (Protected)',
        appointmentDate: '2026-09-05',
        preferredTime: '10:30 AM',
        feeInINR: 5.0,
        paymentStatus: 'PAID',
        appointmentStatus: 'CONFIRMED' as any,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'APP-77105',
        consultationRequestId: 'REQ-PREVIEW-102',
        patientId: 'PAT-90211',
        patientName: 'Rajesh Kumar',
        patientAge: 45,
        patientGender: 'MALE',
        consultationType: 'ONLINE_AUDIO',
        problem: 'Consultation reason provided (Protected)',
        appointmentDate: '2026-09-05',
        preferredTime: '02:00 PM',
        feeInINR: 5.0,
        paymentStatus: 'PAID',
        appointmentStatus: 'CONFIRMED' as any,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  }

  return NextResponse.json(dashboardData, { status: 200 })
}
