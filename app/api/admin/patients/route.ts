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
        p.id,
        p.user_id AS "userId",
        p.full_name AS "fullName",
        u.username,
        u.email,
        p.mobile_number AS "mobileNumber",
        p.date_of_birth AS "dateOfBirth",
        EXTRACT(YEAR FROM age(p.date_of_birth))::int AS age,
        p.gender,
        p.preferred_language AS "preferredLanguage",
        p.city_town_village AS city,
        u.is_active AS "isActive",
        (NOT u.is_active) AS "isSuspended",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM patients p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
    `)

    return NextResponse.json(res.rows, { status: 200 })
  } catch (err) {
    console.error('Fetch patients error:', err)
    return NextResponse.json([], { status: 200 })
  }
}
