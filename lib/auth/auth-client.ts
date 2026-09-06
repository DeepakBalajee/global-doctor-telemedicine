import { LoginCredentials, AuthResult, AuthResponseStatus, UserRole } from '@/types/auth'
import { sanitizeUsernameOrEmail } from './auth-utils'

/**
 * Client API abstraction for authentication (POST /api/auth/login).
 * Connects to server backend API verifying PostgreSQL credentials,
 * password hash, and returning HttpOnly session cookies.
 */
export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<{ success: boolean; redirectUrl?: string; message?: string; status?: AuthResponseStatus; user?: any }> {
  const sanitizedUsernameOrEmail = sanitizeUsernameOrEmail(credentials.usernameOrEmail)

  if (!sanitizedUsernameOrEmail || !credentials.password) {
    return {
      success: false,
      status: AuthResponseStatus.INVALID_CREDENTIALS,
      message: 'Please enter both username/email and password.',
    }
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: sanitizedUsernameOrEmail,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        success: false,
        status: AuthResponseStatus.INVALID_CREDENTIALS,
        message: data.message || 'Invalid username/email or password.',
      }
    }

    return {
      success: true,
      status: AuthResponseStatus.SUCCESS,
      redirectUrl: data.redirectUrl || '/patient/dashboard',
      message: data.message,
      user: data.user,
    }
  } catch {
    return {
      success: false,
      status: AuthResponseStatus.SERVER_ERROR,
      message: 'Unable to connect to the server. Please try again.',
    }
  }
}
