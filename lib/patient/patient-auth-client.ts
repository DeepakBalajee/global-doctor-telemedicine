import {
  PatientLoginCredentials,
  PatientRegistrationPayload,
  PatientDashboardData,
  PatientProfile,
} from '@/types/patient-auth'

/**
 * Client API abstraction for patient login (POST /api/auth/patient/login).
 */
export async function loginPatientWithCredentials(
  credentials: PatientLoginCredentials
): Promise<{ success: boolean; redirectUrl?: string; message?: string }> {
  const usernameOrEmail = credentials.usernameOrEmail.trim()

  if (!usernameOrEmail || !credentials.password) {
    return {
      success: false,
      message: 'Please enter both username/email and password.',
    }
  }

  try {
    const response = await fetch('/api/auth/patient/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return { success: false, message: data.message || 'Invalid username/email or password.' }
    }

    return data
  } catch {
    return {
      success: false,
      message: 'Unable to connect to the server. Please try again.',
    }
  }
}

/**
 * Client API abstraction for patient registration (POST /api/auth/patient/register).
 */
export async function registerPatientAccount(
  payload: PatientRegistrationPayload
): Promise<{ success: boolean; redirectUrl?: string; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/auth/patient/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create patient account.' }
    }

    return data
  } catch {
    return {
      success: false,
      error: 'We couldn’t create your account right now. Please try again.',
    }
  }
}

/**
 * Client API abstraction for patient password reset (POST /api/auth/patient/forgot-password).
 */
export async function requestPatientPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/patient/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })

    const data = await response.json()
    return data
  } catch {
    return {
      success: false,
      message: 'Unable to process password reset request. Please try again.',
    }
  }
}

/**
 * Client API abstraction for retrieving authenticated patient dashboard data (GET /api/patient/dashboard).
 */
export async function getPatientDashboardData(): Promise<PatientDashboardData | null> {
  try {
    const response = await fetch('/api/patient/dashboard')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for updating patient profile (PUT /api/patient/profile).
 */
export async function updatePatientProfile(
  profileData: Partial<PatientProfile>
): Promise<{ success: boolean; profile?: PatientProfile; message?: string }> {
  try {
    const response = await fetch('/api/patient/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    })

    const data = await response.json()
    if (!response.ok) return { success: false, message: data.message || 'Update failed.' }
    return data
  } catch {
    return { success: false, message: 'Unable to connect to server.' }
  }
}

/**
 * Client API abstraction for logging out (POST /api/auth/logout).
 */
export async function logoutPatient(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    return response.ok
  } catch {
    return false
  }
}
