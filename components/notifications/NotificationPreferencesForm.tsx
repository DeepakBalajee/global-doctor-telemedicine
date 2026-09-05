'use client'

import React, { useState, useEffect } from 'react'
import { Bell, ShieldCheck, Mail, MessageSquare, Smartphone, CheckCircle2 } from 'lucide-react'
import { NotificationPreferences } from '@/types/notification'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchNotificationPreferences, updateNotificationPreferences } from '@/lib/notifications/notification-client'

export const NotificationPreferencesForm: React.FC = () => {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const data = await fetchNotificationPreferences()
      setPrefs(data)
    }
    load()
  }, [])

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!prefs) return
    setPrefs({ ...prefs, [key]: !prefs[key] })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prefs) return

    setIsSaving(true)
    const success = await updateNotificationPreferences(prefs)
    if (success) {
      setMessage('Notification preferences updated successfully.')
      setTimeout(() => setMessage(null), 3000)
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
          <Bell className="w-3.5 h-3.5 text-teal-600" /> Channel & Alert Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
          Notification Settings & Controls
        </h1>
        <p className="text-xs text-slate-500">
          Configure real-time alerts across In-App, Email, Push, and SMS channels.
        </p>
      </div>

      {message && (
        <div role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {message}
        </div>
      )}

      {prefs && (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* CHANNELS CARD */}
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              1. Delivery Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900">In-App Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.inAppEnabled}
                  onChange={() => handleToggle('inAppEnabled')}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900">Email Alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.emailEnabled}
                  onChange={() => handleToggle('emailEnabled')}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900">Push Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.pushEnabled}
                  onChange={() => handleToggle('pushEnabled')}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900">SMS Alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.smsEnabled}
                  onChange={() => handleToggle('smsEnabled')}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>
            </div>
          </Card>

          {/* CATEGORIES CARD */}
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              2. Notification Categories
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800">Appointment Reminders & Status Updates</span>
                <input
                  type="checkbox"
                  checked={prefs.appointmentReminders}
                  onChange={() => handleToggle('appointmentReminders')}
                  className="rounded text-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800">Payment Receipts & Financial Alerts</span>
                <input
                  type="checkbox"
                  checked={prefs.paymentUpdates}
                  onChange={() => handleToggle('paymentUpdates')}
                  className="rounded text-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800">Prescription & Medical Record Uploads</span>
                <input
                  type="checkbox"
                  checked={prefs.medicalUpdates}
                  onChange={() => handleToggle('medicalUpdates')}
                  className="rounded text-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200 opacity-90 cursor-not-allowed">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Mandatory Security Alerts (Always Enabled)
                </div>
                <input type="checkbox" checked disabled className="rounded text-amber-600" />
              </label>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="teal"
              size="sm"
              disabled={isSaving}
              className="font-bold text-xs gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" /> {isSaving ? 'Saving Preferences...' : 'Save Preferences'}
            </Button>
          </div>

        </form>
      )}

    </div>
  )
}
