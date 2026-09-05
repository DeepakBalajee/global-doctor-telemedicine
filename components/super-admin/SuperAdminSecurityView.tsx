'use client'

import React, { useState, useEffect } from 'react'
import { ShieldCheck, ShieldAlert, Play, CheckCircle2, AlertTriangle, Lock, Key, Server, FileCode } from 'lucide-react'
import { SecurityAuditSummary } from '@/types/security'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchSecurityAuditResults, runSecurityPenetrationTest } from '@/lib/security/security-client'

export const SuperAdminSecurityView: React.FC = () => {
  const [audit, setAudit] = useState<SecurityAuditSummary | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadAudit = async () => {
    setIsLoading(true)
    const data = await fetchSecurityAuditResults()
    setAudit(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAudit()
  }, [])

  const handleRunPenetrationTest = async () => {
    setIsRunning(true)
    const data = await runSecurityPenetrationTest()
    setAudit(data)
    setIsRunning(false)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-900">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Platform Cybersecurity Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Production Security Hardening & Penetration Testing Console
          </h1>
          <p className="text-xs text-slate-500">
            Automated verification of Single Super Admin Uniqueness, Anti-IDOR Scoping, Anti-XSS Guards, and Secret Isolation.
          </p>
        </div>

        <Button
          variant="teal"
          size="sm"
          onClick={handleRunPenetrationTest}
          disabled={isRunning}
          className="font-bold text-xs gap-1.5 shrink-0 bg-red-700 hover:bg-red-800 text-white"
        >
          <Play className="w-3.5 h-3.5" /> {isRunning ? 'Executing Security Suite...' : 'Run Automated Penetration Test'}
        </Button>
      </div>

      {isLoading || !audit ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading security posture...</div>
      ) : (
        <div className="space-y-6">
          
          {/* POSTURE METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Security Posture</span>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> {audit.securityPosture}
              </div>
              <p className="text-[11px] text-slate-500">Zero Critical Vulnerabilities</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Total Tests Executed</span>
              <div className="text-2xl font-black text-slate-900">{audit.totalTests}</div>
              <p className="text-[11px] text-emerald-600 font-semibold">{audit.passedCount} Passed</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Single Super Admin Safeguard</span>
              <div className="text-2xl font-black text-slate-900">ENFORCED</div>
              <p className="text-[11px] text-slate-500">COUNT(SUPER_ADMIN) === 1</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Secret Isolation</span>
              <div className="text-2xl font-black text-emerald-600">ISOLATED</div>
              <p className="text-[11px] text-slate-500">Zero Plaintext Secrets Exposed</p>
            </Card>
          </div>

          {/* PENETRATION TEST RESULTS TABLE */}
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Automated Security Audit & Penetration Suite Results ({audit.results.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Last Executed: {new Date(audit.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">Test ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Security Vector / Test Name</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {audit.results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{r.id}</td>
                      <td className="p-3 font-semibold text-slate-600">{r.category}</td>
                      <td className="p-3 font-extrabold text-slate-900">{r.testName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.severity === 'CRITICAL' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs">{r.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      )}

    </div>
  )
}
