'use client'

import React, { useState, useEffect } from 'react'
import { ShieldAlert, Lock, AlertTriangle, CheckCircle2, Key, ShieldCheck } from 'lucide-react'
import { SecurityEvent } from '@/types/admin'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getSecurityEvents, changeSuperAdminPassword } from '@/lib/admin/admin-client'

export const SuperAdminSecurityPanel: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true)
      const events = await getSecurityEvents()
      setSecurityEvents(events)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' })
      return
    }

    setIsChangingPassword(true)
    const res = await changeSuperAdminPassword({ currentPassword, newPassword })

    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Super Admin password updated successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setMessage({ type: 'error', text: res.message || 'Password update failed.' })
    }

    setIsChangingPassword(false)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Platform Security Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Security Monitor & Credential Control
          </h1>
          <p className="text-xs text-slate-500">
            Inspect failed login alerts, rate-limiting status, role escalation attempts, and manage Super Admin credentials securely.
          </p>
        </div>
      </div>

      {/* MESSAGE BANNER */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* PASSWORD CHANGE FORM */}
      <Card className="p-6 border-slate-800 bg-slate-900 text-white rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Key className="w-4 h-4" /> Change Super Admin Password (Argon2id / Bcrypt)
        </h3>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full text-xs p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              New Password *
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full text-xs p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full text-xs p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isChangingPassword}
              className="font-bold text-xs gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
            >
              <Lock className="w-3.5 h-3.5" /> {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>

      {/* SECURITY EVENTS TABLE */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" /> Recent Security Alerts & Rate-Limit Events
        </h3>

        {isLoading ? (
          <div className="min-h-[20vh] flex flex-col items-center justify-center space-y-3">
            <p className="text-xs font-semibold text-slate-500">Loading security events...</p>
          </div>
        ) : securityEvents.length > 0 ? (
          <div className="space-y-3 text-xs">
            {securityEvents.map((ev) => (
              <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold">{ev.id}</span>
                    <span className="font-extrabold text-slate-900">{ev.eventType}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        ev.severity === 'CRITICAL' || ev.severity === 'HIGH'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {ev.severity}
                    </span>
                  </div>
                  <p className="text-slate-600">{ev.description}</p>
                </div>

                <div className="text-right text-[10px] font-mono text-slate-400 space-y-0.5">
                  <p>IP: {ev.ipAddress || 'Internal'}</p>
                  <p>{ev.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No security alerts recorded.</p>
        )}
      </Card>

    </div>
  )
}
