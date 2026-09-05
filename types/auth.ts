/**
 * Centralized Role Boundaries for the Global Telemedicine Platform.
 * Note: Administrative boundaries (SUPER_ADMIN and ADMIN) are completely isolated
 * from public, patient, and doctor flows. Roles are strictly server-authoritative.
 */
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',             // Head members with role-based operational permissions
  SUPER_ADMIN = 'SUPER_ADMIN', // Exactly ONE highest-privilege account
}

export interface AuthenticatedUser {
  id: string
  role: UserRole
  name?: string
  email?: string
}

export interface LoginCredentials {
  usernameOrEmail: string
  password?: string
  rememberMe?: boolean
}

export enum AuthResponseStatus {
  SUCCESS = 'SUCCESS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  MFA_REQUIRED = 'MFA_REQUIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
}

export interface AuthResult {
  status: AuthResponseStatus
  user?: AuthenticatedUser
  message?: string
  mfaToken?: string
}

export interface SecurityRequirement {
  title: string
  description: string
  iconName: string
}
