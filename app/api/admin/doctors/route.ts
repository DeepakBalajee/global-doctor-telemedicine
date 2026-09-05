import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DoctorProfile } from '@/types/doctor'

// Simulated complete platform doctor directory including pending verification doctors
const adminDoctorsList: DoctorProfile[] = [
  {
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
    bio: 'Senior Cardiologist specializing in preventive heart health.',
    languages: ['en', 'hi'],
    consultationModes: ['ONLINE_VIDEO', 'ONLINE_AUDIO'],
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    verificationStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'DOC-102',
    userId: 'USR-DOC-102',
    fullName: 'Dr. Rajesh Kumar',
    username: 'dr_rajesh',
    email: 'rajesh.kumar@globaltelemed.org',
    mobileNumber: '+91 98111 22233',
    doctorType: 'GENERAL_PHYSICIAN',
    specialtyName: 'General Medicine',
    medicalQualification: 'MBBS, MD',
    experienceYears: 15,
    licenseNumber: 'MCI-554190',
    licensingAuthority: 'Delhi Medical Council',
    bio: 'Experienced General Physician providing comprehensive primary healthcare.',
    languages: ['en', 'hi', 'ta'],
    consultationModes: ['ONLINE_VIDEO', 'ONLINE_AUDIO', 'OFFLINE'],
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    verificationStatus: 'VERIFIED',
    accountStatus: 'ACTIVE',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'DOC-104',
    userId: 'USR-DOC-104',
    fullName: 'Dr. Vikramaditya Singh',
    username: 'dr_vikram',
    email: 'vikram.singh@globaltelemed.org',
    mobileNumber: '+91 98999 00011',
    doctorType: 'SPECIALIST',
    specialtyId: 'neurology',
    specialtyName: 'Neurology',
    medicalQualification: 'DM (Neurology), MD',
    experienceYears: 8,
    licenseNumber: 'UPMC-99120',
    licensingAuthority: 'UP Medical Council',
    bio: 'Consultant Neurologist undergoing credential verification.',
    languages: ['en', 'hi'],
    consultationModes: ['ONLINE_VIDEO'],
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    verificationStatus: 'PENDING',
    accountStatus: 'ACTIVE',
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('telemed_admin_session')
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!adminCookie && !superAdminCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  return NextResponse.json(adminDoctorsList, { status: 200 })
}
