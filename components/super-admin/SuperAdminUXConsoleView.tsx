'use client'

import React, { useState, useEffect } from 'react'
import { Layout, CheckCircle2, Play, Sparkles, Monitor, Tablet, Smartphone, Eye, HeartHandshake } from 'lucide-react'
import { UXAuditSummary } from '@/types/ux'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchUXAuditStatus, runUXAuditSuite } from '@/lib/ux/ux-client'

export const SuperAdminUXConsoleView: React.FC = () => {
  const [data, setData] = useState<UXAuditSummary | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadAudit = async () => {
    setIsLoading(true)
    const res = await fetchUXAuditStatus()
    setData(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadAudit()
  }, [])

  const handleRunUXAudit = async () => {
    setIsRunning(true)
    const res = await runUXAuditSuite()
    setData(res)
    setIsRunning(false)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> UI/UX & Accessibility Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            User Experience, Consistency & WAI-ARIA Quality Console
          </h1>
          <p className="text-xs text-slate-500">
            Automated evaluation of design tokens, responsive viewports, keyboard accessibility, forms UX, and healthcare visual style.
          </p>
        </div>

        <Button
          variant="teal"
          size="sm"
          onClick={handleRunUXAudit}
          disabled={isRunning}
          className="font-bold text-xs gap-1.5 shrink-0 bg-indigo-700 hover:bg-indigo-800 text-white"
        >
          <Play className="w-3.5 h-3.5" /> {isRunning ? 'Running UI/UX Audit...' : 'Execute UI/UX Audit'}
        </Button>
      </div>

      {isLoading || !data ? (
        <div className="py-16 text-center text-xs text-slate-500">Evaluating UI/UX design quality & accessibility...</div>
      ) : (
        <div className="space-y-6">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Overall UX Score</span>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> {data.overallScore} / 100
              </div>
              <p className="text-[11px] text-slate-500">Status: {data.status}</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Accessibility Score</span>
              <div className="text-2xl font-black text-indigo-600">{data.accessibilityScore}%</div>
              <p className="text-[11px] text-slate-500">WAI-ARIA & High Contrast</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Responsive Layout Readiness</span>
              <div className="text-sm font-extrabold text-slate-900 pt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-600"><Monitor className="w-4 h-4" /> Desktop</span>
                <span className="flex items-center gap-1 text-emerald-600"><Smartphone className="w-4 h-4" /> Mobile</span>
              </div>
              <p className="text-[11px] text-slate-500">Zero Horizontal Overflow</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Healthcare Visual Style</span>
              <div className="text-2xl font-black text-teal-700 flex items-center gap-1.5">
                <HeartHandshake className="w-5 h-5" /> TRUSTED
              </div>
              <p className="text-[11px] text-slate-500">Calm & Professional Palette</p>
            </Card>
          </div>

          {/* UX AUDIT ITEMS TABLE */}
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                12-Vector UI/UX Quality & Accessibility Audit Grid
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Audited At: {new Date(data.timestamp).toLocaleTimeString()}</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Vector</th>
                    <th className="p-3">Design Requirement / UX Objective</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.auditItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-600">{item.vector}</td>
                      <td className="p-3 font-extrabold text-slate-900">{item.title}</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">{item.scorePercentage}%</td>
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
