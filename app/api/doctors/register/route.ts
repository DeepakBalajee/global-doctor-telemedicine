import { NextResponse } from 'next/server'
import { DoctorRegistrationPayload, DoctorProfile } from '@/types/doctor'
import { SPECIALTIES_DATA } from '@/data/specialties'

// In-memory registered doctor database mock store
const registeredDoctorsStore = new Map<string, DoctorProfile>()

export async function POST(request: Request) {
  try {
    const payload: DoctorRegistrationPayload = await request.json()

    const {
      fullName,
      username,
      email,
      mobileNumber,
      password,
      doctorType,
      specialtyId,
      medicalQualification,
      experienceYears,
      licenseNumber,
      licensingAuthority,
      languages,
      consultationModes,
      city,
      state,
      country,
    } = payload

    // 1. Basic required fields validation
    if (
      !fullName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !mobileNumber?.trim() ||
      !password ||
      !doctorType ||
      !medicalQualification?.trim() ||
      experienceYears === undefined ||
      !licenseNumber?.trim() ||
      !licensingAuthority?.trim() ||
      !languages?.length ||
      !consultationModes?.length ||
      !city?.trim() ||
      !state?.trim() ||
      !country?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required registration fields.' },
        { status: 400 }
      )
    }

    // 2. Doctor Type Specific Validation
    if (doctorType === 'SPECIALIST') {
      if (!specialtyId) {
        return NextResponse.json(
          { error: 'Specialists must select a valid medical specialization.' },
          { status: 400 }
        )
      }
    }

    // Resolve specialty name if provided
    let specialtyName: string | undefined = undefined
    if (doctorType === 'SPECIALIST' && specialtyId) {
      const foundSpecialty = SPECIALTIES_DATA.find((s) => s.id === specialtyId || s.slug === specialtyId)
      specialtyName = foundSpecialty ? foundSpecialty.name : specialtyId
    }

    // 3. Uniqueness Check (Username, Email, License Number)
    for (const doc of Array.from(registeredDoctorsStore.values())) {
      if (doc.username.toLowerCase() === username.toLowerCase()) {
        return NextResponse.json({ error: 'Username is already registered.' }, { status: 400 })
      }
      if (doc.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ error: 'Email address is already registered.' }, { status: 400 })
      }
      if (doc.licenseNumber.toLowerCase() === licenseNumber.toLowerCase()) {
        return NextResponse.json({ error: 'Medical license number is already registered.' }, { status: 400 })
      }
    }

    // 4. Create Doctor Profile with Default PENDING Verification Status
    const doctorId = 'DOC-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    const userId = 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase()

    const newDoctor: DoctorProfile = {
      id: doctorId,
      userId,
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      doctorType,
      specialtyId: doctorType === 'SPECIALIST' ? specialtyId : undefined,
      specialtyName: doctorType === 'SPECIALIST' ? specialtyName : 'General Healthcare',
      medicalQualification: medicalQualification.trim(),
      experienceYears: Number(experienceYears),
      licenseNumber: licenseNumber.trim(),
      licensingAuthority: licensingAuthority.trim(),
      bio: payload.bio?.trim(),
      languages,
      consultationModes,
      city: city.trim(),
      town: payload.town?.trim(),
      state: state.trim(),
      country: country.trim(),
      verificationStatus: 'PENDING',
      accountStatus: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    registeredDoctorsStore.set(doctorId, newDoctor)

    return NextResponse.json(
      {
        success: true,
        doctorId,
        verificationStatus: 'PENDING',
        accountStatus: 'PENDING_VERIFICATION',
        message: 'Your doctor registration has been submitted for administrative verification.',
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'We couldn’t process your doctor registration. Please try again.' },
      { status: 500 }
    )
  }
}
