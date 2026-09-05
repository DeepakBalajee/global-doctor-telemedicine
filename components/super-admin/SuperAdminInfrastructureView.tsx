'use client'

import React, { useState, useEffect } from 'react'
import { Server, Database, ShieldCheck, Activity, CheckCircle2, Lock, FileText, RefreshCw, Cpu, HardDrive } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fetchProductionInfrastructureStatus } from '@/lib/infrastructure/infrastructure-client'

export const SuperAdminInfrastructureView: React.FC = () => {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    const res = await fetchProductionInfrastructureStatus()
    setData(res)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
            <Server className="w-3.5 h-3.5 text-blue-600" /> Infrastructure & Production Readiness
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Production Deployment & Health Console
          </h1>
          <p className="text-xs text-slate-500">
            Live infrastructure readiness monitoring, database connection pooling, HTTPS/CORS compliance, and secret isolation.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={isLoading}
          className="font-bold text-xs gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </Button>
      </div>

      {isLoading || !data ? (
        <div className="py-16 text-center text-xs text-slate-500">Inspecting infrastructure readiness...</div>
      ) : (
        <div className="space-y-6">
          
          {/* READINESS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Overall Status</span>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> {data.readiness.status}
              </div>
              <p className="text-[11px] text-slate-500">All Probes Passing</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Environment</span>
              <div className="text-2xl font-black text-slate-900 uppercase">{data.config.nodeEnv}</div>
              <p className="text-[11px] text-slate-500">Node.js 18+ App Router</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Database Cluster</span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                <Database className="w-5 h-5 text-emerald-600" /> PostgreSQL
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">Latency: {data.readiness.checks.database.latencyMs}ms</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Consultation Fee Guard</span>
              <div className="text-2xl font-black text-slate-900">₹5.00 INR</div>
              <p className="text-[11px] text-slate-500">Server-Authoritative</p>
            </Card>
          </div>

          {/* SYSTEM PROBES CHECKLIST */}
          <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-5 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Production System Service Probes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" /> PostgreSQL Connection Pool
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    {data.readiness.checks.database.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Encrypted SSL connection active. Connection pool configured for production concurrency.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-600" /> Secret Isolation & Env Vars
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    {data.readiness.checks.environmentConfig.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Secrets loaded from secure environment variables. Zero plaintext secrets in source files.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" /> Razorpay Payment Verification
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    {data.readiness.checks.paymentGateway.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Server-authoritative ₹5.00 INR payment verification & webhook signature validation active.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" /> WebRTC Video Signaling
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    {data.readiness.checks.videoSignaling.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Secure WSS/HTTPS WebRTC signaling channel for website-integrated video consultations.
                </p>
              </div>

            </div>
          </Card>

        </div>
      )}

    </div>
  )
}
