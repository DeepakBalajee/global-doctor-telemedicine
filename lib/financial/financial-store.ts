import {
  DoctorEarningsSummary,
  DoctorPayout,
  FinancialTransaction,
  PayoutStatus,
} from '@/types/financial'
import { UserRole } from '@/types/auth'
import { db } from '@/lib/db'
import { logAuditEvent } from '@/lib/admin/audit-logger'
import { randomUUID } from 'crypto'

export async function getAllFinancialTransactions(): Promise<FinancialTransaction[]> {
  try {
    const res = await db.query(
      `
      SELECT 
        ft.id,
        ft.payment_id AS "paymentId",
        ft.appointment_id AS "appointmentId",
        ft.patient_id AS "patientId",
        p.full_name AS "patientName",
        ft.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        ft.transaction_type AS "type",
        ft.amount::float AS "amount",
        ft.currency,
        ft.status,
        ft.reference,
        ft.created_at AS "createdAt"
      FROM financial_transactions ft
      LEFT JOIN patients p ON p.id = ft.patient_id
      LEFT JOIN doctors d ON d.id = ft.doctor_id
      ORDER BY ft.created_at DESC
      `
    )
    return res.rows
  } catch (err) {
    console.error('getAllFinancialTransactions error:', err)
    return []
  }
}

export async function getDoctorEarningsSummary(
  doctorUserId: string
): Promise<DoctorEarningsSummary> {
  try {
    const docRes = await db.query(`SELECT id FROM doctors WHERE user_id = $1 LIMIT 1`, [doctorUserId])
    if (docRes.rows.length === 0) {
      return {
        doctorId: '',
        totalEarnings: 0,
        pendingEarnings: 0,
        availableBalance: 0,
        paidOut: 0,
        completedConsultationsCount: 0,
      }
    }

    const doctorId = docRes.rows[0].id

    const txRes = await db.query(
      `
      SELECT 
        id, payment_id AS "paymentId", appointment_id AS "appointmentId",
        transaction_type AS "type", amount::float AS "amount", currency, status, reference, created_at AS "createdAt"
      FROM financial_transactions
      WHERE doctor_id = $1
      ORDER BY created_at DESC
      `,
      [doctorId]
    )

    const payoutsRes = await db.query(
      `
      SELECT 
        id, doctor_id AS "doctorId", amount::float AS "amount", currency, status,
        payout_method AS "payoutMethod", provider_reference AS "providerReference",
        requested_at AS "requestedAt", processed_at AS "processedAt"
      FROM doctor_payouts
      WHERE doctor_id = $1
      ORDER BY created_at DESC
      `,
      [doctorId]
    )

    const appCountRes = await db.query(
      `SELECT COUNT(*)::int AS count FROM appointments WHERE doctor_id = $1 AND appointment_status = 'COMPLETED'`,
      [doctorId]
    )

    const invoicesRes = await db.query(
      `SELECT SUM(doctor_earning)::float AS total FROM financial_invoices WHERE doctor_id = $1 AND status = 'PAID'`,
      [doctorId]
    )

    const totalEarnings = invoicesRes.rows[0]?.total || 0
    const paidOut = (payoutsRes.rows as Array<{ status: string; amount: number }>)
      .filter((p) => p.status === 'PROCESSED' || p.status === 'COMPLETED')
      .reduce((acc, p) => acc + (Number(p.amount) || 0), 0)
    const availableBalance = Math.max(0, totalEarnings - paidOut)

    return {
      doctorId,
      totalEarnings,
      pendingEarnings: availableBalance,
      availableBalance,
      paidOut,
      completedConsultationsCount: appCountRes.rows[0]?.count || 0,
    }
  } catch (err) {
    console.error('getDoctorEarningsSummary error:', err)
    return {
      doctorId: '',
      totalEarnings: 0,
      pendingEarnings: 0,
      availableBalance: 0,
      paidOut: 0,
      completedConsultationsCount: 0,
    }
  }

}

export async function requestDoctorPayout(payload: {
  doctorUserId: string
  amount: number
  payoutMethod: string
}): Promise<{ success: boolean; payout?: DoctorPayout; error?: string }> {
  try {
    const docRes = await db.query(`SELECT id FROM doctors WHERE user_id = $1 LIMIT 1`, [payload.doctorUserId])
    if (docRes.rows.length === 0) {
      return { success: false, error: 'Doctor record not found.' }
    }

    const doctorId = docRes.rows[0].id
    const payoutId = randomUUID()
    const now = new Date().toISOString()

    await db.query(
      `
      INSERT INTO doctor_payouts (
        id, doctor_id, amount, currency, status, payout_method, requested_at
      )
      VALUES ($1, $2, $3, 'INR', 'PENDING', $4, $5)
      `,
      [payoutId, doctorId, payload.amount, payload.payoutMethod, now]
    )

    logAuditEvent({
      actorUserId: payload.doctorUserId,
      actorRole: UserRole.DOCTOR,
      action: 'PAYOUT_REQUESTED',
      targetType: 'PAYOUT',
      targetId: payoutId,
      details: `Requested payout of ₹${payload.amount}`,
      success: true,
    })

    const payout: DoctorPayout = {
      id: payoutId,
      doctorId,
      doctorName: '',
      amount: payload.amount,
      currency: 'INR',
      status: 'PENDING',
      payoutMethod: payload.payoutMethod,
      requestedAt: now,
      createdAt: now,
      updatedAt: now,
    }

    return { success: true, payout }
  } catch (err) {
    console.error('requestDoctorPayout error:', err)
    return { success: false, error: 'Failed to request payout.' }
  }
}

export async function processDoctorPayout(
  payoutId: string,
  adminUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString()
    const ref = `PO-REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const res = await db.query(
      `
      UPDATE doctor_payouts
      SET status = 'PROCESSED', processed_at = $1, provider_reference = $2, updated_at = NOW()
      WHERE id = $3 AND status = 'PENDING'
      `,
      [now, ref, payoutId]
    )

    if ((res.rowCount ?? 0) === 0) {
      return { success: false, error: 'Payout request not found or already processed.' }
    }

    logAuditEvent({
      actorUserId: adminUserId,
      actorRole: UserRole.SUPER_ADMIN,
      action: 'PAYOUT_PROCESSED',
      targetType: 'PAYOUT',
      targetId: payoutId,
      details: `Processed doctor payout request ${payoutId}`,
      success: true,
    })

    return { success: true }
  } catch (err) {
    console.error('processDoctorPayout error:', err)
    return { success: false, error: 'Failed to process payout.' }
  }
}

export async function getAllPayouts(): Promise<DoctorPayout[]> {
  try {
    const res = await db.query(
      `
      SELECT 
        dp.id,
        dp.doctor_id AS "doctorId",
        d.full_name AS "doctorName",
        dp.amount::float AS "amount",
        dp.currency,
        dp.status,
        dp.payout_method AS "payoutMethod",
        dp.provider_reference AS "providerReference",
        dp.requested_at AS "requestedAt",
        dp.processed_at AS "processedAt",
        dp.created_at AS "createdAt",
        dp.updated_at AS "updatedAt"
      FROM doctor_payouts dp
      LEFT JOIN doctors d ON d.id = dp.doctor_id
      ORDER BY dp.created_at DESC
      `
    )
    return res.rows
  } catch {
    return []
  }
}

export async function processPayoutStatus(
  payoutId: string,
  status: PayoutStatus = 'PROCESSED',
  adminUserId: string = 'USR-SA-001'
): Promise<{ success: boolean; error?: string }> {
  return processDoctorPayout(payoutId, adminUserId)
}

export async function processPatientRefund(
  paymentId: string,
  amount: number = 5.0,
  actorUserId: string = 'USR-SA-001'
): Promise<{ success: boolean; error?: string }> {
  try {
    const refId = randomUUID()
    await db.query(
      `
      INSERT INTO financial_transactions (
        id, payment_id, transaction_type, amount, currency, status, reference
      )
      VALUES ($1, $2, 'REFUND', $3, 'INR', 'SUCCESS', 'Patient Consultation Refund')
      `,
      [refId, paymentId, amount]
    )

    logAuditEvent({
      actorUserId,
      actorRole: UserRole.SUPER_ADMIN,
      action: 'PATIENT_REFUND_PROCESSED',
      targetType: 'PAYMENT',
      targetId: paymentId,
      details: `Processed refund of ₹${amount} for payment ${paymentId}`,
      success: true,
    })

    return { success: true }
  } catch (err) {
    console.error('processPatientRefund error:', err)
    return { success: false, error: 'Failed to process refund.' }
  }
}

export async function getDoctorTransactions(
  doctorUserId: string
): Promise<FinancialTransaction[]> {
  try {
    const docRes = await db.query(`SELECT id FROM doctors WHERE user_id = $1 LIMIT 1`, [doctorUserId])
    if (docRes.rows.length === 0) return []
    const doctorId = docRes.rows[0].id

    const txRes = await db.query(
      `
      SELECT 
        id, payment_id AS "paymentId", appointment_id AS "appointmentId",
        transaction_type AS "type", amount::float AS "amount", currency, status, reference, created_at AS "createdAt"
      FROM financial_transactions
      WHERE doctor_id = $1
      ORDER BY created_at DESC
      `,
      [doctorId]
    )
    return txRes.rows
  } catch {
    return []
  }
}


