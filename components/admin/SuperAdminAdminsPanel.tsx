'use client'

import React, { useState, useEffect } from 'react'
import { Crown, ShieldCheck, PlusCircle, UserX, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { AdminAccount, AuditLogEntry } from '@/types/admin'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  getSuperAdminAdmins,
  createAdminAccount,
  suspendAdmin,
  getAuditLogs,
} from '@/lib/admin/admin-client'

export const SuperAdminAdminsPanel: React.FC = () => {
  const [admins, setAdmins] = useState<AdminAccount[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // New Admin form state
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const loadData = async () => {
    setIsLoading(true)
    const [admRes, logRes] = await Promise.all([getSuperAdminAdmins(), getAuditLogs()])
    setAdmins(admRes)
    setAuditLogs(logRes)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !username.trim()) return

    setMessage(null)
    setIsCreating(true)

    const res = await createAdminAccount({
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim() || undefined,
    })

    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Admin created successfully.' })
      setFullName('')
      setUsername('')
      setEmail('')
      loadData()
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to create admin.' })
    }

    setIsCreating(false)
  }

  const handleSuspendAdmin = async (adminId: string) => {
    setMessage(null)
    const res = await suspendAdmin(adminId)
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'Admin suspended.' })
      loadData()
    } else {
      setMessage({ type: 'error', text: res.message || 'Suspension failed.' })
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> Super Admin Control Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Admin Head Members & Audit Logs
          </h1>
          <p className="text-xs text-slate-500">
            Create new authorized Admin head members, suspend accounts, and inspect platform security audit logs. Strictly guarded by COUNT(SUPER_ADMIN) &lt;= 1 safeguard.
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

      {/* CREATE ADMIN FORM */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-amber-600" /> Create New Admin Head Member
        </h3>

        <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Input
            label="Full Name *"
            placeholder="e.g. Dr. Arthur Pendelton"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Unique Username *"
            placeholder="e.g. admin_head_2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Email Address (Optional)"
            placeholder="e.g. arthur@globaltelemed.org"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="sm:col-span-3 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isCreating}
              className="font-bold text-xs gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4" /> {isCreating ? 'Creating Admin...' : 'Create Admin Head Member'}
            </Button>
          </div>
        </form>
      </Card>

      {/* ADMINS LIST */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Active Platform Administrators
        </h3>

        <div className="space-y-3">
          {admins.map((adm) => {
            const isSA = adm.role === 'SUPER_ADMIN'

            return (
              <div key={adm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{adm.fullName}</span>
                    <span className="font-mono text-slate-500">(@{adm.username})</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        isSA ? 'bg-amber-100 text-amber-900' : 'bg-teal-100 text-teal-900'
                      }`}
                    >
                      {adm.role}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                      {adm.accountStatus}
                    </span>
                  </div>
                  <p className="text-slate-500">Email: {adm.email || 'N/A'} • ID: {adm.id}</p>
                </div>

                {!isSA && adm.accountStatus === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuspendAdmin(adm.id)}
                    className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200 gap-1"
                  >
                    <UserX className="w-3.5 h-3.5" /> Suspend
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* SECURITY AUDIT LOGS */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-700" /> Platform Security Audit Trail
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 font-semibold">{log.id}</span>
                  <span className="font-extrabold text-slate-900 uppercase">{log.action}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">{log.actorRole}</span>
                </div>
                <p className="text-slate-600">{log.details}</p>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
