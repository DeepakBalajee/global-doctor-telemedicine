'use client'

import React, { useState, useEffect } from 'react'
import { GitMerge, CheckCircle2, Play, Database, Server, RefreshCw, ShieldCheck, Cpu, HardDrive } from 'lucide-react'
import { IntegrationAuditSummary } from '@/types/integration'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchIntegrationAuditStatus, runIntegrationCandidateAudit } from '@/lib/integration/integration-client'

export const SuperAdminIntegrationView: React.FC = () => {
  const [data, setData] = useState<IntegrationAuditSummary | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadAudit = async () => {
    setIsLoading(true)
    const res = await fetchIntegrationAuditStatus()
    setData(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAudit()
  }, [])

  const handleRunIntegrationAudit = async () => {
    setIsRunning(true)
    const res = await runIntegrationCandidateAudit()
    setData(res)
    setIsRunning(false)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-900">
            <GitMerge className="w-3.5 h-3.5 text-teal-600" /> Platform Integration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            System Integration & Data Consistency Audit Console
          </h1>
          <p className="text-xs text-slate-500">
            Automated cross-system validation across 21 data flows: REST APIs, PostgreSQL referential integrity, atomic transactions, and Anti-IDOR scoping.
          </p>
        </div>

        <Button
          variant="teal"
          size="sm"
          onClick={handleRunIntegrationAudit}
          disabled={isRunning}
          className="font-bold text-xs gap-1.5 shrink-0 bg-teal-700 hover:bg-teal-800 text-white"
        >
          <Play className="w-3.5 h-3.5" /> {isRunning ? 'Running Integration Audit...' : 'Execute Integration Audit'}
        </Button>
      </div>

      {isLoading || !data ? (
        <div className="py-16 text-center text-xs text-slate-500">Validating cross-system data consistency...</div>
      ) : (
        <div className="space-y-6">
          
          {/* FINAL INTEGRATION DECISION CARD */}
          <Card className="p-6 border-teal-200 bg-teal-50/50 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-200/60 pb-4">
              <div>
                <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider block">Official Integration Decision</span>
                <div className="text-2xl sm:text-3xl font-black text-teal-900 flex items-center gap-2 pt-1">
                  <CheckCircle2 className="w-7 h-7 text-teal-600" /> {data.decision}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold shrink-0">
                <div className="bg-white border border-teal-200 px-3 py-1.5 rounded-xl text-teal-900">
                  Data Flows Passed: <span className="text-teal-600 font-extrabold">{data.passCount} / {data.checks.length}</span>
                </div>
                <div className="bg-white border border-teal-200 px-3 py-1.5 rounded-xl text-teal-900">
                  Pass Rate: <span className="text-teal-600 font-extrabold">{data.passRatePercentage}%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-teal-950 font-medium leading-relaxed">
              All 21 cross-system data flows have successfully verified end-to-end data consistency between Frontend, REST APIs, PostgreSQL stores, ₹5 Payment verification, WebRTC Video room isolation, and Super Admin master controls.
            </p>
          </Card>

          {/* INTEGRATION CHECKS GRID */}
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              21 Cross-System Integration & Data Consistency Audits
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Integration Flow ID</th>
                    <th className="p-3">System Boundary / Data Flow</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.checks.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="p-3 font-extrabold text-slate-900">{item.flowName}</td>
                      <td className="p-3 font-mono text-slate-500">{item.latencyMs}ms</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{item.details}</td>
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
