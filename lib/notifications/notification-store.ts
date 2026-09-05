import { NotificationItem, NotificationPreferences, NotificationType, NotificationPriority } from '@/types/notification'
import { UserRole } from '@/types/auth'
import { db } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function getNotificationsForUser(userId: string): Promise<NotificationItem[]> {
  try {
    const res = await db.query(
      `
      SELECT 
        id,
        recipient_user_id AS "recipientUserId",
        recipient_role AS "recipientRole",
        notification_type AS "type",
        title,
        message,
        priority,
        is_read AS "isRead",
        created_at AS "createdAt",
        read_at AS "readAt",
        deep_link AS "deepLink",
        metadata
      FROM notifications
      WHERE recipient_user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    )
    return res.rows
  } catch (err) {
    console.error('getNotificationsForUser error:', err)
    return []
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const res = await db.query(
      `SELECT COUNT(*)::int AS count FROM notifications WHERE recipient_user_id = $1 AND is_read = false`,
      [userId]
    )
    return res.rows[0]?.count || 0
  } catch {
    return 0
  }
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean }> {
  try {
    await db.query(
      `UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1 AND recipient_user_id = $2`,
      [notificationId, userId]
    )
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function createNotification(payload: {
  recipientUserId: string
  recipientRole: UserRole
  type: NotificationType
  title: string
  message: string
  priority?: NotificationPriority
  deepLink?: string
  metadata?: any
}): Promise<NotificationItem> {
  const notifId = randomUUID()
  const now = new Date().toISOString()

  try {
    await db.query(
      `
      INSERT INTO notifications (
        id, recipient_user_id, recipient_role, notification_type, title, message, priority, is_read, created_at, deep_link, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8, $9, $10)
      `,
      [
        notifId,
        payload.recipientUserId,
        payload.recipientRole,
        payload.type,
        payload.title,
        payload.message,
        payload.priority || 'NORMAL',
        now,
        payload.deepLink || null,
        payload.metadata ? JSON.stringify(payload.metadata) : null,
      ]
    )
  } catch (err) {
    console.error('createNotification error:', err)
  }

  return {
    id: notifId,
    recipientUserId: payload.recipientUserId,
    recipientRole: payload.recipientRole,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    priority: payload.priority || 'NORMAL',
    isRead: false,
    createdAt: now,
    deepLink: payload.deepLink,
    metadata: payload.metadata,
  }
}

export async function getUserNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  try {
    const res = await db.query(
      `
      SELECT 
        user_id AS "userId",
        in_app_enabled AS "inAppEnabled",
        email_enabled AS "emailEnabled",
        sms_enabled AS "smsEnabled",
        push_enabled AS "pushEnabled",
        appointment_reminders AS "appointmentReminders",
        payment_updates AS "paymentUpdates",
        chat_notifications AS "chatNotifications",
        medical_updates AS "medicalUpdates",
        security_alerts AS "securityAlerts"
      FROM notification_preferences
      WHERE user_id = $1
      LIMIT 1
      `,
      [userId]
    )

    if (res.rows.length > 0) {
      return res.rows[0]
    }
  } catch {}

  return {
    userId,
    inAppEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: false,
    appointmentReminders: true,
    paymentUpdates: true,
    chatNotifications: true,
    medicalUpdates: true,
    securityAlerts: true,
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<{ success: boolean }> {
  try {
    await db.query(
      `UPDATE notifications SET is_read = true, read_at = NOW() WHERE recipient_user_id = $1 AND is_read = false`,
      [userId]
    )
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function updateUserNotificationPreferences(
  userId: string,
  prefs: Partial<NotificationPreferences>
): Promise<{ success: boolean; preferences?: NotificationPreferences; error?: string }> {
  try {
    const existing = await getUserNotificationPreferences(userId)
    const updated = { ...existing, ...prefs }

    await db.query(
      `
      INSERT INTO notification_preferences (
        user_id, in_app_enabled, email_enabled, sms_enabled, push_enabled,
        appointment_reminders, payment_updates, chat_notifications, medical_updates, security_alerts
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id) DO UPDATE
      SET in_app_enabled = EXCLUDED.in_app_enabled,
          email_enabled = EXCLUDED.email_enabled,
          sms_enabled = EXCLUDED.sms_enabled,
          push_enabled = EXCLUDED.push_enabled,
          appointment_reminders = EXCLUDED.appointment_reminders,
          payment_updates = EXCLUDED.payment_updates,
          chat_notifications = EXCLUDED.chat_notifications,
          medical_updates = EXCLUDED.medical_updates,
          security_alerts = EXCLUDED.security_alerts
      `,
      [
        userId,
        updated.inAppEnabled,
        updated.emailEnabled,
        updated.smsEnabled,
        updated.pushEnabled,
        updated.appointmentReminders,
        updated.paymentUpdates,
        updated.chatNotifications,
        updated.medicalUpdates,
        updated.securityAlerts,
      ]
    )

    return { success: true, preferences: updated }
  } catch (err) {
    console.error('updateUserNotificationPreferences error:', err)
    return { success: false, error: 'Failed to update preferences.' }
  }
}

