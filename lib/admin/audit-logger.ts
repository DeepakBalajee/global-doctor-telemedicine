import { AuditLogEntry } from '@/types/admin'
import { UserRole } from '@/types/auth'
import { db } from '@/lib/db'

export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    id: 'AUD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    timestamp: new Date().toISOString(),
    ...entry,
  }

  // Persist to PostgreSQL asynchronously
  db.query(
    `
    INSERT INTO audit_logs (
      actor_user_id, actor_role, action, target_type, target_id, details, timestamp, ip_address, success
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      entry.actorUserId && entry.actorUserId !== 'ANONYMOUS' && !entry.actorUserId.includes('USR-') ? entry.actorUserId : null,
      entry.actorRole || 'PATIENT',
      entry.action,
      entry.targetType || null,
      entry.targetId || null,
      entry.details || '',
      newEntry.timestamp,
      entry.ipAddress || '127.0.0.1',
      entry.success ?? true,
    ]
  ).catch((err: unknown) => {
    console.error('Failed to log audit event to DB:', err)
  })

  return newEntry
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const res = await db.query(
      `
      SELECT id, actor_user_id AS "actorUserId", actor_role AS "actorRole", action, target_type AS "targetType", target_id AS "targetId", details, timestamp, ip_address AS "ipAddress", success
      FROM audit_logs
      ORDER BY timestamp DESC
      LIMIT 100
      `
    )
    return res.rows
  } catch {
    return []
  }
}
