'use client'

import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { NotificationItem } from '@/types/notification'
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/lib/notifications/notification-client'
import { NotificationDropdown } from './NotificationDropdown'

export interface NotificationBellProps {
  role?: string
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ role = 'PATIENT' }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const notificationsPageUrl =
    role === 'SUPER_ADMIN'
      ? '/super-admin/notifications'
      : role === 'ADMIN'
      ? '/admin/notifications'
      : role === 'DOCTOR'
      ? '/doctor/notifications'
      : '/patient/notifications'

  const loadUnread = async () => {
    const count = await fetchUnreadCount()
    setUnreadCount(count)
  }

  const loadPreview = async () => {
    const res = await fetchNotifications(1, 5)
    setNotifications(res.notifications)
  }

  useEffect(() => {
    loadUnread()
  }, [])

  const handleToggle = () => {
    if (!isOpen) {
      loadPreview()
    }
    setIsOpen(!isOpen)
  }

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id)
    loadUnread()
    loadPreview()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead()
    loadUnread()
    loadPreview()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
        aria-label="View Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsOpen(false)}
          notificationsPageUrl={notificationsPageUrl}
        />
      )}
    </div>
  )
}
