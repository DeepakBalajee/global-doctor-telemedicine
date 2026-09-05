'use client'

import React from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, ArrowRight, ShieldAlert, Calendar, CreditCard, Stethoscope } from 'lucide-react'
import { NotificationItem } from '@/types/notification'

export interface NotificationDropdownProps {
  notifications: NotificationItem[]
  unreadCount: number
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
  notificationsPageUrl: string
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onClose,
  notificationsPageUrl,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl py-3 z-50 animate-in fade-in duration-150">
      
      {/* DROPDOWN HEADER */}
      <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h4 className="text-xs font-extrabold text-slate-900">Recent Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* NOTIFICATIONS LIST PREVIEW */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => onMarkRead(item.id)}
                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1.5 ${
                  !item.isRead ? 'bg-teal-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{item.title}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      item.priority === 'CRITICAL' || item.priority === 'HIGH'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{item.message}</p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  {item.deepLink && (
                    <Link
                      href={item.deepLink}
                      onClick={onClose}
                      className="text-teal-700 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center space-y-1 text-slate-400 text-xs">
            <Bell className="w-6 h-6 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">No new notifications</p>
            <p className="text-[11px]">You are all caught up!</p>
          </div>
        )}
      </div>

      {/* DROPDOWN FOOTER */}
      <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
        <Link
          href={notificationsPageUrl}
          onClick={onClose}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
        >
          View All Notifications <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}
