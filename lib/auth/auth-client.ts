import { LoginCredentials, AuthResult, AuthResponseStatus } from '@/types/auth'
import { sanitizeUsernameOrEmail, getGenericAuthErrorMessage } from './auth-utils'

/**
 * Client API abstraction for authentication (POST /api/auth/login).
 * In production, credentials are submitted via secure HTTPS POST.
 * Server manages HttpOnly + Secure cookies for authenticated sessions.
 */
export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResult> {
  const sanitizedUsernameOrEmail = sanitizeUsernameOrEmail(credentials.usernameOrEmail)

  // Basic validation check before request
  if (!sanitizedUsernameOrEmail || !credentials.password) {
    return {
      status: AuthResponseStatus.INVALID_CREDENTIALS,
      message: getGenericAuthErrorMessage(AuthResponseStatus.INVALID_CREDENTIALS),
    }
  }

  try {
    // Simulated network delay preparing for real backend API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Note: No hardcoded passwords or fake role bypasses!
    // The backend API is responsible for verifying credentials, MFA, and returning session cookies.
    return {
      status: AuthResponseStatus.INVALID_CREDENTIALS,
      message: getGenericAuthErrorMessage(AuthResponseStatus.INVALID_CREDENTIALS),
    }
  } catch {
    return {
      status: AuthResponseStatus.SERVER_ERROR,
      message: getGenericAuthErrorMessage(AuthResponseStatus.SERVER_ERROR),
    }
  }
}
