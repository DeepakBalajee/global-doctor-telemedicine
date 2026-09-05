import {
  DoctorLoginCredentials,
  DoctorAuthResult,
  DoctorAuthResponseStatus,
} from '@/types/doctor-auth'

/**
 * Client API abstraction for doctor login (POST /api/auth/doctor/login).
 */
export async function loginDoctorWithCredentials(
  credentials: DoctorLoginCredentials
): Promise<DoctorAuthResult> {
  const usernameOrEmail = credentials.usernameOrEmail.trim()

  if (!usernameOrEmail || !credentials.password) {
    return {
      status: 'INVALID_CREDENTIALS',
      message: 'Please enter both username/email and password.',
    }
  }

  try {
    const response = await fetch('/api/auth/doctor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
    })

    const data: DoctorAuthResult = await response.json()
    return data
  } catch {
    return {
      status: 'SERVER_ERROR',
      message: 'Unable to connect to the server. Please try again.',
    }
  }
}

/**
 * Client API abstraction for doctor password reset (POST /api/auth/doctor/forgot-password).
 */
export async function requestDoctorPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/doctor/forgot-password', {
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
 * Client API abstraction for fetching current authenticated user (GET /api/auth/me).
 */
export async function getAuthenticatedDoctorMe() {
  try {
    const response = await fetch('/api/auth/me')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Client API abstraction for logging out (POST /api/auth/logout).
 */
export async function logoutDoctor(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    return response.ok
  } catch {
    return false
  }
}
