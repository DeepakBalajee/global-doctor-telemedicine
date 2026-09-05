import { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Platform Maintenance Mode | Global Doctor Telemedicine Platform',
  description: 'The platform is currently under scheduled maintenance.',
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="p-8 sm:p-10 border-slate-800 bg-slate-950 text-white shadow-2xl rounded-2xl max-w-lg w-full text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg mx-auto">
          <AlertTriangle className="h-8 w-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
            Scheduled Maintenance Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
            System Maintenance Mode
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            The platform is currently undergoing scheduled infrastructure upgrades. Normal patient and doctor access is temporarily restricted.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 text-left font-mono">
          <p><strong className="text-amber-400">Notice:</strong> Telemedicine API services will resume shortly.</p>
          <p>Support: support@globaltelemed.org</p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs font-semibold text-slate-300 border-slate-700 hover:bg-slate-800">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Check Status
            </Button>
          </Link>

          <Link href="/super-admin/login">
            <Button variant="primary" size="sm" className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Super Admin Portal
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
