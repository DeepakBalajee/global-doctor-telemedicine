'use client'

import React, { useState, useEffect } from 'react'
import { Activity, CheckCircle2, AlertTriangle, ShieldCheck, Server } from 'lucide-react'
import { SystemHealthStatus } from '@/types/admin'
import { Card } from '@/components/ui/Card'
import { getSystemHealth } from '@/lib/admin/admin-client'

export const SystemHealthPanel: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<SystemHealthStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHealth() {
      setIsLoading(true)
      const res = await getSystemHealth()
      setHealthStatus(res)
      setIsLoading(false)
    }
    loadHealth()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">
            <Activity className="w-3.5 h-3.5 text-emerald-600" /> Operational System Health Indicators
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Platform Service Status Monitor
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status indicators for API endpoints, database cluster, authentication guard, and payment gateway. Infrastructure secrets strictly protected.
          </p>
        </div>
      </div>

      {/* HEALTH CARDS GRID */}
      {isLoading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
          <p className="text-xs font-semibold text-slate-500">Checking service health status...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {healthStatus.map((service) => (
            <Card key={service.serviceName} className="p-6 border-slate-200 bg-white rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{service.serviceName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Latency: {service.latencyMs} ms</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {service.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  )
}
