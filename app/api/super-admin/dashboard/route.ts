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
    return NextResponse.json(
      { error: 'Forbidden. Super Admin session required.' },
      { status: 403 }
    )
  }

  try {
    const [patRes, docRes, admRes, apptRes, payRes, rxRes, docuRes, sesRes] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE u.is_active = true)::int AS active, COUNT(*) FILTER (WHERE u.is_active = false)::int AS suspended FROM patients p JOIN users u ON u.id = p.user_id`),
      db.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE verification_status = 'VERIFIED' AND account_status = 'ACTIVE')::int AS verified, COUNT(*) FILTER (WHERE verification_status = 'PENDING')::int AS pending FROM doctors`),
      db.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE account_status = 'ACTIVE')::int AS active FROM admin_accounts`),
      db.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE appointment_status = 'COMPLETED')::int AS completed, COUNT(*) FILTER (WHERE appointment_status = 'CANCELLED')::int AS cancelled FROM appointments`),
      db.query(`SELECT COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total_revenue FROM financial_transactions WHERE transaction_type = 'PATIENT_PAYMENT' AND status = 'SUCCESS'`),
      db.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'ISSUED')::int AS active, COUNT(*) FILTER (WHERE status = 'REVOKED')::int AS revoked FROM prescriptions`),
      db.query(`SELECT COUNT(*)::int AS total FROM medical_documents`),
      db.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'IN_PROGRESS' OR status = 'SCHEDULED')::int AS active FROM consultation_sessions`),
    ])

    const pat = patRes.rows[0] || {}
    const doc = docRes.rows[0] || {}
    const adm = admRes.rows[0] || {}
    const appt = apptRes.rows[0] || {}
    const pay = payRes.rows[0] || {}
    const rx = rxRes.rows[0] || {}
    const docu = docuRes.rows[0] || {}
    const ses = sesRes.rows[0] || {}

    return NextResponse.json(
      {
        totalPatients: pat.total || 0,
        activePatients: pat.active || 0,
        suspendedPatients: pat.suspended || 0,

        totalDoctors: doc.total || 0,
        verifiedDoctors: doc.verified || 0,
        pendingDoctors: doc.pending || 0,

        totalAdmins: adm.total || 0,
        activeAdmins: adm.active || 0,

        totalAppointments: appt.total || 0,
        completedAppointments: appt.completed || 0,
        cancelledAppointments: appt.cancelled || 0,

        totalConsultations: ses.total || 0,
        activeConsultations: ses.active || 0,

        totalPrescriptions: rx.total || 0,
        activePrescriptions: rx.active || 0,
        revokedPrescriptions: rx.revoked || 0,

        totalMedicalDocuments: docu.total || 0,

        totalRevenueInINR: parseFloat(pay.total_revenue || '0.00'),
        successfulPayments: pay.count || 0,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Super Admin Dashboard error:', err)
    return NextResponse.json(
      {
        totalPatients: 0,
        activePatients: 0,
        suspendedPatients: 0,
        totalDoctors: 0,
        verifiedDoctors: 0,
        pendingDoctors: 0,
        totalAdmins: 1,
        activeAdmins: 1,
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        totalConsultations: 0,
        activeConsultations: 0,
        totalPrescriptions: 0,
        activePrescriptions: 0,
        revokedPrescriptions: 0,
        totalMedicalDocuments: 0,
        totalRevenueInINR: 0,
        successfulPayments: 0,
      },
      { status: 200 }
    )
  }
}
