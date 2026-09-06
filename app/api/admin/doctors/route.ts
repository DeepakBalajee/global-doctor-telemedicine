import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export async function GET() {
  const cookieStore = cookies()
  const token =
    cookieStore.get('telemed_super_admin_session')?.value ||
    cookieStore.get('telemed_superadmin_session')?.value ||
    cookieStore.get('telemed_admin_session')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const res = await db.query(`
      SELECT 
        d.id,
        d.user_id AS "userId",
        d.full_name AS "fullName",
        d.username,
        d.email,
        d.mobile_number AS "mobileNumber",
        d.doctor_type AS "doctorType",
        d.specialty_id AS "specialtyId",
        d.specialty_name AS "specialtyName",
        d.medical_qualification AS "medicalQualification",
        d.experience_years AS "experienceYears",
        d.license_number AS "licenseNumber",
        d.licensing_authority AS "licensingAuthority",
        d.bio,
        d.languages,
        d.consultation_modes AS "consultationModes",
        d.city,
        d.state,
        d.country,
        d.verification_status AS "verificationStatus",
        d.account_status AS "accountStatus",
        d.created_at AS "createdAt",
        d.updated_at AS "updatedAt"
      FROM doctors d
      ORDER BY d.created_at DESC
    `)

    return NextResponse.json(res.rows, { status: 200 })
  } catch (err) {
    console.error('Fetch doctors error:', err)
    return NextResponse.json([], { status: 200 })
  }
}
