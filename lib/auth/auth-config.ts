import { UserRole } from '@/types/auth'

export const AUTH_CONFIG = {
  // Conceptual API endpoints prepared for backend integration
  LOGIN_ENDPOINT: '/api/auth/login',
  LOGOUT_ENDPOINT: '/api/auth/logout',
  SESSION_ENDPOINT: '/api/auth/session',
  MFA_VERIFY_ENDPOINT: '/api/auth/mfa/verify',
  PASSWORD_RESET_ENDPOINT: '/api/auth/password-reset',

  // Role default route redirection paths (Server-authoritative authorization required)
  ROLE_REDIRECTS: {
    [UserRole.PATIENT]: '/patient',
    [UserRole.DOCTOR]: '/doctor',
    [UserRole.ADMIN]: '/admin',
    [UserRole.SUPER_ADMIN]: '/super-admin',
  },

  // Security message constants
  MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid username or password.',
    RATE_LIMITED: 'Too many sign-in attempts. Please try again later.',
    ACCOUNT_LOCKED: 'Your account is temporarily locked due to repeated failed attempts. Please try again later.',
    SERVER_ERROR: 'We couldn’t sign you in right now. Please try again.',
    MFA_REQUIRED: 'Multi-factor authentication is required to complete sign in.',
  },
}
