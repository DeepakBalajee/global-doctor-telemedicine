'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, ExternalLink, ShieldAlert, Filter, Check } from 'lucide-react'
import { NotificationItem } from '@/types/notification'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/notifications/notification-client'

export const NotificationCenterView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')
  const [isLoading, setIsLoading] = useState(true)

  const loadNotifs = async () => {
    setIsLoading(true)
    const res = await fetchNotifications()
    setNotifications(res.notifications)
    setIsLoading(false)
  }

  useEffect(() => {
    loadNotifs()
  }, [])

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id)
    loadNotifs()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    loadNotifs()
  }

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead
    if (filter === 'READ') return n.isRead
    return true
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <Bell className="w-3.5 h-3.5 text-teal-600" /> Platform Communication Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time appointment alerts, payment confirmations, and system notifications.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          className="font-bold text-xs gap-1.5 shrink-0"
        >
          <CheckCheck className="w-3.5 h-3.5 text-teal-600" /> Mark All as Read
        </Button>
      </div>

      {/* TABS FILTER */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        {(['ALL', 'UNREAD', 'READ'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-3 shadow-sm">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading notifications...</div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl transition-colors flex gap-4 items-start ${
                  !n.isRead ? 'bg-teal-50/50 font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  {n.priority === 'CRITICAL' || n.priority === 'HIGH' ? (
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                  ) : (
                    <Bell className="w-5 h-5 text-teal-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{n.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        n.priority === 'CRITICAL' ? 'bg-red-100 text-red-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {n.priority}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{n.message}</p>

                  {n.deepLink && (
                    <Link
                      href={n.deepLink}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline pt-1"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(n.id)}
                    className="p-1 text-slate-400 hover:text-teal-600"
                    title="Mark Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">No notifications match this filter.</div>
        )}
      </Card>

    </div>
  )
}
