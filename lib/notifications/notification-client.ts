import { NotificationItem, NotificationPreferences } from '@/types/notification'

export async function fetchNotifications(
  page?: number,
  limit?: number
): Promise<{ notifications: NotificationItem[]; total: number }> {
  try {
    const res = await fetch('/api/notifications')
    if (!res.ok) return { notifications: [], total: 0 }
    const list: NotificationItem[] = await res.json()
    return { notifications: list, total: list.length }
  } catch {
    return { notifications: [], total: 0 }
  }
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  try {
    const res = await fetch('/api/notifications/unread-count')
    if (!res.ok) return 0
    const data = await res.json()
    return data.unreadCount || 0
  } catch {
    return 0
  }
}

export const fetchUnreadCount = fetchUnreadNotificationCount

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    return res.ok
  } catch {
    return false
  }
}

export const markNotificationRead = markNotificationAsRead

export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications/read-all', { method: 'POST' })
    return res.ok
  } catch {
    return false
  }
}

export const markAllNotificationsRead = markAllNotificationsAsRead

export async function fetchNotificationPreferences(): Promise<NotificationPreferences | null> {
  try {
    const res = await fetch('/api/settings/notifications')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreferences>
): Promise<boolean> {
  try {
    const res = await fetch('/api/settings/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendTypingSignal(appointmentId: string, isTyping: boolean): Promise<boolean> {
  try {
    const res = await fetch(`/api/consultations/${appointmentId}/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isTyping }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function fetchTypingSignal(appointmentId: string): Promise<{ isTyping: boolean; userName?: string }> {
  try {
    const res = await fetch(`/api/consultations/${appointmentId}/typing`)
    if (!res.ok) return { isTyping: false }
    return await res.json()
  } catch {
    return { isTyping: false }
  }
}
