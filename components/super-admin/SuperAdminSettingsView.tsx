'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Users,
  Calendar,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Save,
  Globe,
  Stethoscope,
  ShieldAlert,
} from 'lucide-react'
import { PlatformSettings } from '@/types/settings'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getPlatformSettings, updatePlatformSettings } from '@/lib/admin/admin-client'

export const SuperAdminSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'consultations' | 'users' | 'security' | 'payments' | 'maintenance'
  >('general')
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Maintenance Confirmation Modal
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)

  const loadSettings = async () => {
    setIsLoading(true)
    const res = await getPlatformSettings()
    if (res) setSettings(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setMessage(null)
    setIsSaving(true)

    const res = await updatePlatformSettings(settings)
    if (res.success && res.settings) {
      setSettings(res.settings)
      setMessage({ type: 'success', text: res.message || 'Platform settings saved successfully.' })
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update settings.' })
    }

    setIsSaving(false)
  }

  const handleToggleMaintenance = async () => {
    if (!settings) return
    const newMode = !settings.maintenanceMode

    setMessage(null)
    setIsSaving(true)

    const res = await updatePlatformSettings({ ...settings, maintenanceMode: newMode })
    if (res.success && res.settings) {
      setSettings(res.settings)
      setMessage({
        type: 'success',
        text: newMode
          ? 'Platform Maintenance Mode ENABLED. Normal access restricted.'
          : 'Platform Maintenance Mode DISABLED. Normal access restored.',
      })
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to update maintenance mode.' })
    }

    setIsSaving(false)
    setIsMaintenanceModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading master platform settings...</p>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <Settings className="w-3.5 h-3.5 text-amber-600" /> Master Platform Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Global Platform Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Master Super Admin controls for platform identity, registration rules, security policy, payment gateway status, and maintenance mode.
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

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 text-xs font-bold">
        {[
          { key: 'general', label: 'General Identity', icon: Globe },
          { key: 'consultations', label: 'Appointments & Consultations', icon: Calendar },
          { key: 'users', label: 'Registration & Inspection', icon: Users },
          { key: 'security', label: 'Authentication & Security', icon: Lock },
          { key: 'payments', label: 'Payment Gateway (₹5)', icon: CreditCard },
          { key: 'maintenance', label: 'Danger Zone & Maintenance', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
                isActive
                  ? 'border-amber-500 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* TAB 1: GENERAL PLATFORM SETTINGS */}
        {activeTab === 'general' && (
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-600" /> Platform Identity & Regional Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Platform Public Name *"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                required
              />

              <Input
                label="Support Email Address *"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                required
              />

              <Input
                label="Support Phone Helpline *"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                required
              />

              <Input
                label="Default Timezone *"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                required
              />

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Currency (Fixed)</span>
                <p className="font-extrabold text-slate-900 text-sm">INR (₹)</p>
                <p className="text-[10px] text-slate-500">Fixed to Indian Rupee across all payment routes.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consultation Fee (Fixed)</span>
                <p className="font-extrabold text-emerald-700 text-sm">₹5.00 INR</p>
                <p className="text-[10px] text-slate-500">Server-authoritative fixed consultation rate.</p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 2: APPOINTMENTS & CONSULTATIONS */}
        {activeTab === 'consultations' && (
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" /> Consultation & State Machine Controls
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Supported Consultation Modes</h4>
                <p className="text-slate-500">
                  Online Video Call, Online Audio Call, and Offline Clinic Visits are active and supported across patient booking flows.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Appointment Lifecycle State Machine</h4>
                <p className="text-slate-600 font-mono text-[11px]">
                  PAYMENT_PENDING → PAID → REQUESTED → CONFIRMED → COMPLETED (or CANCELLED)
                </p>
                <p className="text-slate-500">
                  Invalid status transitions (e.g. COMPLETED → PAYMENT_PENDING) are strictly rejected server-side.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: USER REGISTRATION & GUEST INSPECTION */}
        {activeTab === 'users' && (
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-600" /> Registration Policies & Guest Inspection Controls
            </h3>

            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.doctorRegistrationEnabled}
                  onChange={(e) => setSettings({ ...settings, doctorRegistrationEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Doctor Self-Registration Enabled</span>
                  <span className="text-slate-500 text-[11px]">Allows new medical practitioners to register on /doctor/register.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.doctorVerificationRequired}
                  onChange={(e) => setSettings({ ...settings, doctorVerificationRequired: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Mandatory Doctor Verification Queue</span>
                  <span className="text-slate-500 text-[11px]">Newly registered doctors remain PENDING until approved by an Admin.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.patientRegistrationEnabled}
                  onChange={(e) => setSettings({ ...settings, patientRegistrationEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Patient Account Registration Enabled</span>
                  <span className="text-slate-500 text-[11px]">Allows patients to register accounts on /patient/register.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.guestInspectionEnabled}
                  onChange={(e) => setSettings({ ...settings, guestInspectionEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Guest Patient Inspection Enabled</span>
                  <span className="text-slate-500 text-[11px]">Allows guest visitors to inspect doctors & submit details without forced login.</span>
                </div>
              </label>
            </div>
          </Card>
        )}

        {/* TAB 4: AUTHENTICATION & SECURITY */}
        {activeTab === 'security' && (
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" /> Authentication Policies & Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Minimum Password Length *"
                type="number"
                value={settings.minPasswordLength}
                onChange={(e) => setSettings({ ...settings, minPasswordLength: Number(e.target.value) })}
                required
              />

              <Input
                label="Session Timeout (Minutes) *"
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                required
              />

              <Input
                label="Rate Limit Threshold (Req/Min) *"
                type="number"
                value={settings.rateLimitRequestsPerMin}
                onChange={(e) => setSettings({ ...settings, rateLimitRequestsPerMin: Number(e.target.value) })}
                required
              />
            </div>
          </Card>
        )}

        {/* TAB 5: PAYMENT GATEWAY */}
        {activeTab === 'payments' && (
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Razorpay Payment Configuration Status
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Gateway Integrator</span>
                <p className="font-extrabold text-slate-900 text-sm">Razorpay Subscriptions & One-Time API</p>
                <p className="text-slate-500">HMAC-SHA256 signature verification active.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Server-Side Security Protection</span>
                <p className="font-extrabold text-xs">Gateway Private Keys & Secrets Excluded from Frontend</p>
                <p className="text-[11px] text-emerald-800">
                  Razorpay secret keys remain strictly server-side. Price manipulation from client inputs is blocked.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 6: DANGER ZONE & MAINTENANCE MODE */}
        {activeTab === 'maintenance' && (
          <Card className="p-6 border-red-200 bg-red-50/40 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-900 border-b border-red-200 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Danger Zone & Platform Maintenance Mode
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-xl border border-red-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">Platform Maintenance Mode</span>
                    <span className="text-slate-500 text-[11px]">
                      Restricts normal public, patient, and doctor access to /maintenance while keeping Super Admin control active.
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      settings.maintenanceMode
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {settings.maintenanceMode ? 'MAINTENANCE ACTIVE' : 'NORMAL OPERATIONS'}
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMaintenanceModalOpen(true)}
                    className={`font-bold text-xs ${
                      settings.maintenanceMode
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                        : 'bg-red-600 hover:bg-red-700 text-white border-transparent'
                    }`}
                  >
                    {settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Safeguard Note</span>
                <p className="text-slate-600 text-[11px]">
                  Dangerous operations such as &quot;Reset Database&quot; or &quot;Delete Super Admin&quot; are strictly disabled at the application boundary.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* SAVE BUTTON BAR */}
        {activeTab !== 'maintenance' && (
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
              className="font-bold text-xs gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving Settings...' : 'Save Configuration Changes'}
            </Button>
          </div>
        )}

      </form>

      {/* MAINTENANCE CONFIRMATION MODAL */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <Card className="p-6 max-w-md w-full bg-white border-slate-200 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-slate-900">
                Confirm Maintenance Mode Toggle
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to {settings.maintenanceMode ? 'DISABLE' : 'ENABLE'} platform maintenance mode?
              {!settings.maintenanceMode && (
                <span className="block font-semibold text-red-600 pt-1">
                  Enabling maintenance mode will restrict normal patient and doctor access to a maintenance notice page.
                </span>
              )}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleToggleMaintenance}
                className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Confirm Change
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
