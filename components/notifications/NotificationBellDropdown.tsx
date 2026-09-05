'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, ExternalLink, ShieldAlert } from 'lucide-react'
import { NotificationItem } from '@/types/notification'
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/notifications/notification-client'

export const NotificationBellDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifs = async () => {
    const res = await fetchNotifications()
    setNotifications(res.notifications)
    setUnreadCount(res.notifications.filter((n) => !n.isRead).length)
  }

  useEffect(() => {
    loadNotifs()
    const interval = setInterval(loadNotifs, 10000) // 10s poll simulate real-time socket events
    return () => clearInterval(interval)
  }, [])

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await markNotificationAsRead(id)
    loadNotifs()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    loadNotifs()
  }

  return (
    <div className="relative">
      
      {/* BELL BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="View Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
          
          {/* HEADER */}
          <div className="p-3.5 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[10px] font-extrabold text-teal-900">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 text-xs transition-colors hover:bg-slate-50 flex gap-3 items-start ${
                    !n.isRead ? 'bg-teal-50/40 font-medium' : 'opacity-80'
                  }`}
                >
                  <div className="shrink-0 pt-0.5">
                    {n.priority === 'CRITICAL' || n.priority === 'HIGH' ? (
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-1" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 line-clamp-1">{n.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">{n.message}</p>

                    {n.deepLink && (
                      <Link
                        href={n.deepLink}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 hover:underline pt-1"
                      >
                        Open <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkRead(n.id, e)}
                      title="Mark as read"
                      className="text-slate-400 hover:text-teal-600 p-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">No notifications.</div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-2.5 bg-slate-50 text-center">
            <Link
              href="/patient/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              View Notification Center →
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}
