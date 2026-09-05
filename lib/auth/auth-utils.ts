import { AuthResponseStatus } from '@/types/auth'
import { AUTH_CONFIG } from './auth-config'

/**
 * Trim and sanitize text input to prevent leading/trailing whitespace errors
 */
export function sanitizeUsernameOrEmail(input: string): string {
  return input.trim()
}

/**
 * Returns generic, security-compliant error message to prevent account existence enumeration
 */
export function getGenericAuthErrorMessage(status: AuthResponseStatus): string {
  switch (status) {
    case AuthResponseStatus.INVALID_CREDENTIALS:
      return AUTH_CONFIG.MESSAGES.INVALID_CREDENTIALS
    case AuthResponseStatus.RATE_LIMITED:
      return AUTH_CONFIG.MESSAGES.RATE_LIMITED
    case AuthResponseStatus.ACCOUNT_LOCKED:
      return AUTH_CONFIG.MESSAGES.ACCOUNT_LOCKED
    case AuthResponseStatus.MFA_REQUIRED:
      return AUTH_CONFIG.MESSAGES.MFA_REQUIRED
    case AuthResponseStatus.SERVER_ERROR:
    default:
      return AUTH_CONFIG.MESSAGES.SERVER_ERROR
  }
}
