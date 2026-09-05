'use client'

import React, { useState } from 'react'
import { Bell, Mail, Smartphone, ShieldCheck, CheckCircle2, Save } from 'lucide-react'
import { NotificationPreferences } from '@/types/notification'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const NotificationPreferencesPanel: React.FC = () => {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    inAppEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    appointmentReminders: true,
    paymentUpdates: true,
    chatNotifications: true,
    medicalUpdates: true,
    securityAlerts: true,
  })
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6 max-w-xl mx-auto">
      <div className="space-y-1 border-b border-slate-100 pb-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" /> Communication Channel Preferences
        </h3>
        <p className="text-xs text-slate-500">
          Manage how you receive appointment status updates, consultation reminders, and platform alerts.
        </p>
      </div>

      {isSaved && (
        <div role="alert" className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Notification preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.inAppEnabled}
            onChange={(e) => setPrefs({ ...prefs, inAppEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <div>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-teal-600" /> In-App Real-Time Alerts (Recommended)
            </span>
            <span className="text-slate-500 text-[11px]">Receive live notification badges and popovers in your workstation header.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.emailEnabled}
            onChange={(e) => setPrefs({ ...prefs, emailEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <div>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" /> Email Notifications
            </span>
            <span className="text-slate-500 text-[11px]">Receive appointment confirmations and payment receipts via email.</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.smsEnabled}
            onChange={(e) => setPrefs({ ...prefs, smsEnabled: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <div>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" /> SMS Text Alerts
            </span>
            <span className="text-slate-500 text-[11px]">Receive urgent consultation SMS alerts on your verified mobile number.</span>
          </div>
        </label>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="teal" size="md" className="font-bold text-xs gap-1.5">
            <Save className="w-4 h-4" /> Save Preferences
          </Button>
        </div>
      </form>
    </Card>
  )
}
