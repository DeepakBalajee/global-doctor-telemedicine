import { AdminAccount } from '@/types/admin'
import { UserRole } from '@/types/auth'
import { logAuditEvent } from './audit-logger'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { randomUUID } from 'crypto'

export const adminAccountsStore = new Map<string, AdminAccount>()


/**
 * Enforces database-level & application-level safeguard: COUNT(SUPER_ADMIN) <= 1
 */
export async function getSuperAdminCount(): Promise<number> {
  try {
    const res = await db.query(
      `SELECT COUNT(*)::int AS count FROM users WHERE role = 'SUPER_ADMIN'`
    )
    return res.rows[0]?.count || 0
  } catch {
    return 1
  }
}

export async function createAdminHeadAccount(payload: {
  fullName: string
  username: string
  email?: string
  password?: string
  creatorUserId: string
}): Promise<{ success: boolean; admin?: AdminAccount; error?: string }> {
  const cleanUsername = payload.username.trim()
  const cleanEmail = payload.email?.trim().toLowerCase() || null

  try {
    const existing = await db.query(
      `SELECT id FROM users WHERE LOWER(username) = LOWER($1) OR (email IS NOT NULL AND LOWER(email) = LOWER($2)) LIMIT 1`,
      [cleanUsername, cleanEmail]
    )

    if (existing.rows.length > 0) {
      return { success: false, error: 'Username or email already exists. Please choose a unique username.' }
    }

    const userId = randomUUID()
    const adminId = randomUUID()
    const passwordHash = await hashPassword(payload.password || 'Admin@123456')

    const client = await db.connect()
    try {
      await client.query('BEGIN')

      await client.query(
        `
        INSERT INTO users (id, username, email, password_hash, role, name, is_active)
        VALUES ($1, $2, $3, $4, 'ADMIN', $5, true)
        `,
        [userId, cleanUsername, cleanEmail, passwordHash, payload.fullName.trim()]
      )

      await client.query(
        `
        INSERT INTO admin_accounts (id, user_id, full_name, username, email, role, account_status)
        VALUES ($1, $2, $3, $4, $5, 'ADMIN', 'ACTIVE')
        `,
        [adminId, userId, payload.fullName.trim(), cleanUsername, cleanEmail]
      )

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

    const newAdmin: AdminAccount = {
      id: adminId,
      userId,
      fullName: payload.fullName.trim(),
      username: cleanUsername,
      email: cleanEmail || undefined,
      role: UserRole.ADMIN,
      accountStatus: 'ACTIVE',
      createdBy: payload.creatorUserId,
      createdAt: new Date().toISOString(),
    }

    logAuditEvent({
      actorUserId: payload.creatorUserId,
      actorRole: UserRole.SUPER_ADMIN,
      action: 'ADMIN_CREATED',
      targetType: 'ADMIN',
      targetId: newAdmin.id,
      details: `Super Admin created new Admin head member: ${newAdmin.username}`,
      success: true,
    })

    return { success: true, admin: newAdmin }
  } catch (err) {
    console.error('createAdminHeadAccount error:', err)
    return { success: false, error: 'Failed to create Admin account. Please try again.' }
  }
}

export async function toggleAdminStatus(
  adminId: string,
  newStatus: 'ACTIVE' | 'SUSPENDED',
  actorUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminRes = await db.query(
      `
      SELECT a.id, a.user_id, a.username, a.role, a.account_status
      FROM admin_accounts a
      WHERE a.id = $1 OR a.user_id = $1
      LIMIT 1
      `,
      [adminId]
    )

    if (adminRes.rows.length === 0) {
      return { success: false, error: 'Admin account not found.' }
    }

    const admin = adminRes.rows[0]

    if (admin.role === UserRole.SUPER_ADMIN) {
      logAuditEvent({
        actorUserId,
        actorRole: UserRole.ADMIN,
        action: 'UNAUTHORIZED_SUPER_ADMIN_MUTATION_ATTEMPT',
        targetType: 'SUPER_ADMIN',
        targetId: adminId,
        details: 'Attempted to suspend Super Admin account.',
        success: false,
      })
      return { success: false, error: 'Super Admin account cannot be suspended.' }
    }

    const isActive = newStatus === 'ACTIVE'

    await db.query(
      `UPDATE admin_accounts SET account_status = $1 WHERE id = $2`,
      [newStatus, admin.id]
    )

    await db.query(
      `UPDATE users SET is_active = $1 WHERE id = $2`,
      [isActive, admin.user_id]
    )

    logAuditEvent({
      actorUserId,
      actorRole: UserRole.SUPER_ADMIN,
      action: newStatus === 'SUSPENDED' ? 'ADMIN_SUSPENDED' : 'ADMIN_ACTIVATED',
      targetType: 'ADMIN',
      targetId: admin.id,
      details: `Admin ${admin.username} account status updated to ${newStatus}.`,
      success: true,
    })

    return { success: true }
  } catch (err) {
    console.error('toggleAdminStatus error:', err)
    return { success: false, error: 'Failed to update Admin status.' }
  }
}

export async function changeSuperAdminPassword(
  currentPassword?: string,
  newPassword?: string,
  superAdminUserId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' }
  }

  try {
    const saRes = await db.query(`SELECT id FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1`)
    if (saRes.rows.length === 0) {
      return { success: false, error: 'Super Admin account not found.' }
    }

    const saId = saRes.rows[0].id
    const newHash = await hashPassword(newPassword)

    await db.query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [newHash, saId])

    logAuditEvent({
      actorUserId: superAdminUserId || saId,
      actorRole: UserRole.SUPER_ADMIN,
      action: 'SUPER_ADMIN_PASSWORD_CHANGED',
      targetType: 'SUPER_ADMIN',
      targetId: saId,
      details: 'Super Admin password successfully updated with scrypt hashing.',
      success: true,
    })

    return { success: true }
  } catch (err) {
    console.error('changeSuperAdminPassword error:', err)
    return { success: false, error: 'Failed to update password.' }
  }
}
