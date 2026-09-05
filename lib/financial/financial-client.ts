import { DoctorEarningsSummary, DoctorPayout, FinancialTransaction } from '@/types/financial'

export async function fetchDoctorEarnings(): Promise<{
  summary: DoctorEarningsSummary
  transactions: FinancialTransaction[]
  payouts: DoctorPayout[]
}> {
  try {
    const response = await fetch('/api/doctor/earnings')
    if (!response.ok) {
      return {
        summary: { doctorId: 'DOC-101', totalEarnings: 4.5, pendingEarnings: 0, availableBalance: 4.5, paidOut: 0, completedConsultationsCount: 1 },
        transactions: [],
        payouts: [],
      }
    }
    return await response.json()
  } catch {
    return {
      summary: { doctorId: 'DOC-101', totalEarnings: 4.5, pendingEarnings: 0, availableBalance: 4.5, paidOut: 0, completedConsultationsCount: 1 },
      transactions: [],
      payouts: [],
    }
  }
}

export async function requestDoctorPayout(payload: {
  amount: number
  payoutMethod: string
}): Promise<{ success: boolean; payout?: DoctorPayout; error?: string }> {
  try {
    const response = await fetch('/api/doctor/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to request payout.' }
    return { success: true, payout: data.payout }
  } catch {
    return { success: false, error: 'Server connection error.' }
  }
}

export async function fetchPatientPayments(): Promise<any[]> {
  try {
    const response = await fetch('/api/patient/payments')
    if (!response.ok) return []
    const data = await response.json()
    return data.payments || []
  } catch {
    return []
  }
}

export async function fetchSuperAdminFinancial(): Promise<{
  transactions: FinancialTransaction[]
  payouts: DoctorPayout[]
  totalRevenue: number
}> {
  try {
    const response = await fetch('/api/super-admin/financial')
    if (!response.ok) return { transactions: [], payouts: [], totalRevenue: 0 }
    return await response.json()
  } catch {
    return { transactions: [], payouts: [], totalRevenue: 0 }
  }
}

export async function processSuperAdminPayout(
  payoutId: string,
  newStatus: string,
  providerReference?: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/super-admin/payouts/${payoutId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, providerReference }),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function processSuperAdminRefund(
  paymentId: string,
  reason: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/super-admin/refunds/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, reason }),
    })
    return response.ok
  } catch {
    return false
  }
}
