import {
  AppointmentSearchParams,
  DoctorSearchParams,
  DoctorSearchResponse,
  GlobalSearchResult,
  PatientSearchParams,
} from '@/types/search'
import { db } from '@/lib/db'
import { getPrescriptionsForUser } from '@/lib/medical-records/prescription-store'
import { getMedicalDocumentsForUser } from '@/lib/medical-records/document-store'
import { getAllFinancialTransactions } from '@/lib/financial/financial-store'
import { UserRole } from '@/types/auth'

export async function searchDoctorsInStore(
  params: DoctorSearchParams
): Promise<DoctorSearchResponse> {
  try {
    const page = params.page || 1
    const limit = params.limit || 10
    const offset = (page - 1) * limit

    let whereConditions = ["d.verification_status = 'VERIFIED'", "d.account_status = 'ACTIVE'"]
    let queryParams: any[] = []

    if (params.query?.trim()) {
      queryParams.push(`%${params.query.trim().toLowerCase()}%`)
      whereConditions.push(
        `(LOWER(d.full_name) LIKE $${queryParams.length} OR LOWER(d.specialty_name) LIKE $${queryParams.length} OR LOWER(d.city) LIKE $${queryParams.length})`
      )
    }

    if (params.doctorType && params.doctorType !== 'ALL') {
      queryParams.push(params.doctorType)
      whereConditions.push(`d.doctor_type = $${queryParams.length}`)
    }

    if (params.specialization && params.specialization !== 'ALL') {
      queryParams.push(`%${params.specialization.toLowerCase()}%`)
      whereConditions.push(`LOWER(d.specialty_name) LIKE $${queryParams.length}`)
    }

    if (params.location && params.location !== 'ALL') {
      queryParams.push(`%${params.location.toLowerCase()}%`)
      whereConditions.push(`(LOWER(d.city) LIKE $${queryParams.length} OR LOWER(d.state) LIKE $${queryParams.length})`)
    }

    const whereClause = whereConditions.join(' AND ')

    const countRes = await db.query(
      `SELECT COUNT(*)::int AS count FROM doctors d WHERE ${whereClause}`,
      queryParams
    )

    const totalResults = countRes.rows[0]?.count || 0

    const dataRes = await db.query(
      `
      SELECT 
        d.id,
        d.full_name AS "fullName",
        d.email,
        d.doctor_type AS "doctorType",
        d.specialty_name AS "specialization",
        CONCAT(d.city, ', ', d.state) AS "location",
        d.languages,
        d.consultation_modes AS "consultationTypes",
        d.verification_status AS "verificationStatus",
        d.account_status AS "accountStatus",
        d.experience_years AS "experienceYears"
      FROM doctors d
      WHERE ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `,
      [...queryParams, limit, offset]
    )

    const results = (dataRes.rows as any[]).map((doc: any) => ({
      ...doc,
      availability: 'TODAY',
      rating: 4.9,
      languages: typeof doc.languages === 'string' ? JSON.parse(doc.languages) : doc.languages || [],
      consultationTypes: typeof doc.consultationTypes === 'string' ? JSON.parse(doc.consultationTypes) : doc.consultationTypes || [],
    }))

    const totalPages = Math.ceil(totalResults / limit) || 1

    let specializations: string[] = []
    let locations: string[] = []

    try {
      const specsRes = await db.query(`SELECT DISTINCT specialty_name FROM doctors WHERE specialty_name IS NOT NULL`)
      specializations = specsRes.rows.map((r: any) => r.specialty_name)

      const locsRes = await db.query(`SELECT DISTINCT city FROM doctors WHERE city IS NOT NULL`)
      locations = locsRes.rows.map((r: any) => r.city)
    } catch {}

    return {
      results,
      pagination: {
        page,
        limit,
        total: totalResults,
        totalPages,
      },
      specializations,
      locations,
    }
  } catch (err) {
    console.error('searchDoctorsInStore error:', err)
    return {
      results: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
      specializations: [],
      locations: [],
    }
  }
}

export async function searchPatientsInStore(params: PatientSearchParams): Promise<any> {
  try {
    let whereConditions: string[] = []
    let queryParams: any[] = []

    if (params.query?.trim()) {
      queryParams.push(`%${params.query.trim().toLowerCase()}%`)
      whereConditions.push(
        `(LOWER(p.full_name) LIKE $1 OR LOWER(u.email) LIKE $1 OR LOWER(p.mobile_number) LIKE $1)`
      )
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''

    const res = await db.query(
      `
      SELECT 
        p.id,
        p.user_id AS "userId",
        p.full_name AS "fullName",
        u.email,
        p.mobile_number AS "mobileNumber",
        p.date_of_birth AS "dateOfBirth",
        p.gender,
        p.city_town_village AS "city",
        u.is_active AS "isActive",
        u.created_at AS "createdAt"
      FROM patients p
      JOIN users u ON u.id = p.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      `,
      queryParams
    )

    return {
      results: res.rows,
      totalResults: res.rows.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    }
  } catch (err) {
    console.error('searchPatientsInStore error:', err)
    return { results: [], totalResults: 0, page: 1, limit: 20, totalPages: 1 }
  }
}

export async function performSuperAdminGlobalSearch(
  query: string,
  userRole: UserRole
): Promise<GlobalSearchResult> {
  const emptyResult: GlobalSearchResult = {
    query: query || '',
    doctors: [],
    patients: [],
    appointments: [],
    payments: [],
    prescriptions: [],
  }

  if ((userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.ADMIN) || !query?.trim()) {
    return emptyResult
  }

  const cleanQ = `%${query.trim().toLowerCase()}%`

  try {
    const docRes = await db.query(
      `SELECT id, full_name AS "fullName", specialty_name AS "specialization", email FROM doctors WHERE LOWER(full_name) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(specialty_name) LIKE $1 LIMIT 5`,
      [cleanQ]
    )

    const patRes = await db.query(
      `SELECT p.id, p.full_name AS "fullName", u.email FROM patients p JOIN users u ON u.id = p.user_id WHERE LOWER(p.full_name) LIKE $1 OR LOWER(u.email) LIKE $1 LIMIT 5`,
      [cleanQ]
    )

    const appRes = await db.query(
      `SELECT a.id, p.full_name AS "patientName", d.full_name AS "doctorName" FROM appointments a JOIN patients p ON p.id = a.patient_id JOIN doctors d ON d.id = a.doctor_id WHERE LOWER(p.full_name) LIKE $1 OR LOWER(d.full_name) LIKE $1 OR LOWER(a.id::text) LIKE $1 LIMIT 5`,
      [cleanQ]
    )

    return {
      query,
      doctors: docRes.rows,
      patients: patRes.rows,
      appointments: appRes.rows,
      payments: [],
      prescriptions: [],
    }
  } catch (err) {
    console.error('performSuperAdminGlobalSearch error:', err)
    return emptyResult
  }
}

export async function executeMasterGlobalSearch(
  query: string,
  userRole: UserRole = UserRole.SUPER_ADMIN
): Promise<GlobalSearchResult> {
  return performSuperAdminGlobalSearch(query, userRole)
}

export async function searchAppointmentsInStore(params: AppointmentSearchParams): Promise<any> {
  try {
    let whereConditions: string[] = []
    let queryParams: any[] = []

    if (params.query?.trim()) {
      queryParams.push(`%${params.query.trim().toLowerCase()}%`)
      whereConditions.push(
        `(LOWER(p.full_name) LIKE $1 OR LOWER(d.full_name) LIKE $1 OR LOWER(a.id::text) LIKE $1)`
      )
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''

    const res = await db.query(
      `
      SELECT 
        a.id,
        a.consultation_request_id AS "consultationRequestId",
        a.patient_id AS "patientId",
        p.full_name AS "patientName",
        a.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        a.consultation_type AS "consultationType",
        a.appointment_date::text AS "appointmentDate",
        a.appointment_status AS "appointmentStatus"
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      ${whereClause}
      ORDER BY a.appointment_date DESC
      `,
      queryParams
    )

    return {
      results: res.rows,
      totalResults: res.rows.length,
      page: 1,
      limit: 20,
      totalPages: 1,
    }
  } catch (err) {
    console.error('searchAppointmentsInStore error:', err)
    return { results: [], totalResults: 0, page: 1, limit: 20, totalPages: 1 }
  }
}

