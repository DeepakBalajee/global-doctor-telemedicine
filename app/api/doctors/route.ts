import { NextResponse } from 'next/server'
import { DoctorProfile } from '@/types/doctor'
import { SPECIALTIES_DATA } from '@/data/specialties'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const specialtyId = searchParams.get('specialtyId')
  const doctorType = searchParams.get('doctorType')
  const search = searchParams.get('search')?.toLowerCase()

  // Verified & Active Doctors Directory
  const verifiedDoctorsList: DoctorProfile[] = [
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
      bio: 'Senior Cardiologist specializing in preventive heart health, hypertension treatment, and non-invasive consultations.',
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
      bio: 'Experienced General Physician providing comprehensive primary healthcare, routine evaluations, and fever management.',
      languages: ['en', 'hi', 'ta'],
      consultationModes: ['ONLINE_VIDEO', 'ONLINE_AUDIO', 'OFFLINE'],
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      verificationStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'DOC-103',
      userId: 'USR-DOC-103',
      fullName: 'Dr. Priya Sundaram',
      username: 'dr_priya',
      email: 'priya.sundaram@globaltelemed.org',
      mobileNumber: '+91 98444 55566',
      doctorType: 'SPECIALIST',
      specialtyId: 'dermatology',
      specialtyName: 'Dermatology',
      medicalQualification: 'MD (Dermatology), DNB',
      experienceYears: 9,
      licenseNumber: 'TNMC-78901',
      licensingAuthority: 'Tamil Nadu Medical Council',
      bio: 'Specialist Dermatologist focusing on skin healthcare, acne treatment, rashes, and video consultations.',
      languages: ['en', 'ta', 'te'],
      consultationModes: ['ONLINE_VIDEO'],
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      verificationStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  let result = verifiedDoctorsList.filter(
    (doc) => doc.verificationStatus === 'VERIFIED' && doc.accountStatus === 'ACTIVE'
  )

  if (specialtyId) {
    result = result.filter((doc) => doc.specialtyId === specialtyId || doc.specialtyId === 'general-medicine')
  }

  if (doctorType) {
    result = result.filter((doc) => doc.doctorType === doctorType)
  }

  if (search) {
    result = result.filter(
      (doc) =>
        doc.fullName.toLowerCase().includes(search) ||
        doc.specialtyName?.toLowerCase().includes(search) ||
        doc.city.toLowerCase().includes(search)
    )
  }

  return NextResponse.json(result, { status: 200 })
}
