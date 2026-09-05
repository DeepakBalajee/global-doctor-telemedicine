import {
  AdminAccount,
  AuditLogEntry,
  AdminDashboardData,
  SuperAdminDashboardData,
  SecurityEvent,
  SystemHealthStatus,
} from '@/types/admin'
import { PlatformSettings } from '@/types/settings'
import { DoctorProfile } from '@/types/doctor'
import { PatientProfile } from '@/types/patient-auth'
import { PatientAppointmentDetail } from '@/types/patient-appointment'

/**
 * Admin Login API abstraction (POST /api/auth/admin/login).
 */
export async function adminLogin(payload: { usernameOrEmail: string; password?: string }): Promise<{
  success: boolean
  user?: any
  message?: string
}> {
  try {
    const response = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.message || 'Invalid username or password.' }
    return { success: true, user: data.user }
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}

/**
 * Super Admin Login API abstraction (POST /api/auth/super-admin/login).
 */
export async function superAdminLogin(payload: { usernameOrEmail: string; password?: string }): Promise<{
  success: boolean
  user?: any
  message?: string
}> {
  try {
    const response = await fetch('/api/auth/super-admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.message || 'Invalid username or password.' }
    return { success: true, user: data.user }
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}

/**
 * Fetch Admin Dashboard Statistics (GET /api/admin/dashboard).
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData | null> {
  try {
    const response = await fetch('/api/admin/dashboard')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Fetch Super Admin Dashboard Statistics (GET /api/super-admin/dashboard).
 */
export async function getSuperAdminDashboardData(): Promise<SuperAdminDashboardData | null> {
  try {
    const response = await fetch('/api/super-admin/dashboard')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Fetch Doctors Directory (GET /api/admin/doctors).
 */
export async function getAdminDoctors(): Promise<DoctorProfile[]> {
  try {
    const response = await fetch('/api/admin/doctors')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Approve Doctor Verification (PATCH /api/admin/doctors/[doctorId]/approve).
 */
export async function approveDoctor(doctorId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/admin/doctors/${doctorId}/approve`, { method: 'PATCH' })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Approval failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Reject Doctor Verification (PATCH /api/admin/doctors/[doctorId]/reject).
 */
export async function rejectDoctor(doctorId: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/admin/doctors/${doctorId}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Rejection failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Suspend Doctor Account (PATCH /api/admin/doctors/[doctorId]/suspend).
 */
export async function suspendDoctor(doctorId: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/admin/doctors/${doctorId}/suspend`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Suspension failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Reactivate Doctor Account (PATCH /api/super-admin/doctors/[doctorId]/activate).
 */
export async function activateDoctor(doctorId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/super-admin/doctors/${doctorId}/activate`, { method: 'PATCH' })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Reactivation failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Fetch Patient Accounts Directory (GET /api/admin/patients).
 */
export async function getAdminPatients(): Promise<PatientProfile[]> {
  try {
    const response = await fetch('/api/admin/patients')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Suspend Patient Account (PATCH /api/super-admin/patients/[patientId]/suspend).
 */
export async function suspendPatient(patientId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/super-admin/patients/${patientId}/suspend`, { method: 'PATCH' })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Suspension failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Reactivate Patient Account (PATCH /api/super-admin/patients/[patientId]/activate).
 */
export async function activatePatient(patientId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/super-admin/patients/${patientId}/activate`, { method: 'PATCH' })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Reactivation failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Fetch Platform Appointments (GET /api/admin/appointments).
 */
export async function getAdminAppointments(): Promise<PatientAppointmentDetail[]> {
  try {
    const response = await fetch('/api/admin/appointments')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Fetch Payment Transaction Receipts (GET /api/admin/payments).
 */
export async function getAdminPayments(): Promise<any[]> {
  try {
    const response = await fetch('/api/admin/payments')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Super Admin: Fetch Admin Head Members List (GET /api/super-admin/admins).
 */
export async function getSuperAdminAdmins(): Promise<AdminAccount[]> {
  try {
    const response = await fetch('/api/super-admin/admins')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Super Admin: Create Admin Head Member Account (POST /api/super-admin/admins).
 */
export async function createAdminAccount(payload: {
  fullName: string
  username: string
  email?: string
  password?: string
}): Promise<{ success: boolean; admin?: AdminAccount; message?: string }> {
  try {
    const response = await fetch('/api/super-admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Failed to create admin.' }
    return { success: true, admin: data.admin, message: 'Admin account created successfully.' }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Super Admin: Suspend Admin Account (PATCH /api/super-admin/admins/[adminId]/suspend).
 */
export async function suspendAdmin(adminId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/super-admin/admins/${adminId}/suspend`, { method: 'PATCH' })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Suspension failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Super Admin: Activate Admin Account (PATCH /api/super-admin/admins/[adminId]/activate).
 */
export async function activateAdmin(adminId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`/api/super-admin/admins/${adminId}/activate`, { method: 'PATCH' })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Reactivation failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Super Admin: Fetch Security Audit Logs (GET /api/super-admin/audit-logs).
 */
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const response = await fetch('/api/super-admin/audit-logs')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Super Admin: Fetch Security Events (GET /api/super-admin/security/events).
 */
export async function getSecurityEvents(): Promise<SecurityEvent[]> {
  try {
    const response = await fetch('/api/super-admin/security/events')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Super Admin: Change Password (POST /api/super-admin/security/password).
 */
export async function changeSuperAdminPassword(payload: {
  currentPassword?: string
  newPassword?: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/super-admin/security/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Password update failed.' }
    return { success: true, message: data.message }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}

/**
 * Super Admin: Fetch System Health Status (GET /api/super-admin/system-health).
 */
export async function getSystemHealth(): Promise<SystemHealthStatus[]> {
  try {
    const response = await fetch('/api/super-admin/system-health')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

/**
 * Super Admin: Fetch Global Platform Settings (GET /api/super-admin/settings).
 */
export async function getPlatformSettings(): Promise<PlatformSettings | null> {
  try {
    const response = await fetch('/api/super-admin/settings')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Super Admin: Update Global Platform Settings (PATCH /api/super-admin/settings).
 */
export async function updatePlatformSettings(
  settings: Partial<PlatformSettings>
): Promise<{ success: boolean; settings?: PlatformSettings; message?: string }> {
  try {
    const response = await fetch('/api/super-admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, message: data.error || 'Settings update failed.' }
    return { success: true, settings: data.settings, message: 'Platform settings updated successfully.' }
  } catch {
    return { success: false, message: 'Server connection error.' }
  }
}
