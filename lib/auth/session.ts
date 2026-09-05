import { randomBytes, createHash } from 'crypto'
import { db } from '@/lib/db'
import { UserRole } from '@/types/auth'

export interface AuthenticatedUserSession {
  sessionId: string
  userId: string
  username: string
  email: string
  role: UserRole
  name: string
  isActive: boolean
  patientId?: string
  doctorId?: string
  adminId?: string
  verificationStatus?: string
  accountStatus?: string
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Creates a database-backed session in PostgreSQL.
 * Returns the unhashed raw token to be stored in HttpOnly cookie.
 */
export async function createDBSession(
  userId: string,
  role: UserRole,
  maxAgeDays: number = 7
): Promise<string> {
  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000)

  await db.query(
    `
    INSERT INTO sessions (user_id, token_hash, role, expires_at)
    VALUES ($1, $2, $3, $4)
    `,
    [userId, tokenHash, role, expiresAt]
  )

  return rawToken
}

/**
 * Validates raw session token against PostgreSQL sessions table.
 * Returns null if session is invalid, expired, or revoked.
 */
export async function validateDBSession(
  rawToken: string
): Promise<AuthenticatedUserSession | null> {
  if (!rawToken || typeof rawToken !== 'string') return null

  const tokenHash = hashToken(rawToken)

  try {
    const res = await db.query(
      `
      SELECT 
        s.id AS session_id,
        s.role AS session_role,
        s.expires_at,
        s.revoked_at,
        u.id AS user_id,
        u.username,
        u.email,
        u.role AS user_role,
        u.name,
        u.is_active,
        p.id AS patient_id,
        d.id AS doctor_id,
        d.verification_status,
        d.account_status,
        a.id AS admin_id
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN patients p ON p.user_id = u.id
      LEFT JOIN doctors d ON d.user_id = u.id
      LEFT JOIN admin_accounts a ON a.user_id = u.id
      WHERE s.token_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > NOW()
        AND u.is_active = true
      LIMIT 1
      `,
      [tokenHash]
    )

    if (res.rows.length === 0) {
      return null
    }

    const row = res.rows[0]

    // Asynchronously update last_used_at timestamp
    db.query('UPDATE sessions SET last_used_at = NOW() WHERE id = $1', [row.session_id]).catch(() => {})

    return {
      sessionId: row.session_id,
      userId: row.user_id,
      username: row.username || '',
      email: row.email || '',
      role: row.user_role as UserRole,
      name: row.name || '',
      isActive: row.is_active,
      patientId: row.patient_id || undefined,
      doctorId: row.doctor_id || undefined,
      adminId: row.admin_id || undefined,
      verificationStatus: row.verification_status || undefined,
      accountStatus: row.account_status || undefined,
    }
  } catch (err) {
    console.error('Session validation query error:', err)
    return null
  }
}

/**
 * Revokes a session in PostgreSQL.
 */
export async function revokeDBSession(rawToken: string): Promise<boolean> {
  if (!rawToken) return false
  const tokenHash = hashToken(rawToken)

  try {
    const res = await db.query(
      `UPDATE sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL`,
      [tokenHash]
    )
    return (res.rowCount ?? 0) > 0
  } catch {
    return false
  }
}
