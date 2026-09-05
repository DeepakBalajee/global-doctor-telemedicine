import React from 'react'
import {
  User,
  Video,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Lock,
  CreditCard,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'

export interface PaymentSummaryCardProps {
  patientName?: string
  consultationTypeTitle?: string
  appointmentDate?: string
  preferredTime?: string
  location?: string
  preferredLanguage?: string
  consultationRequestId?: string
}

export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  patientName = 'Patient Request',
  consultationTypeTitle = 'Online — Video Call',
  appointmentDate = new Date().toISOString().split('T')[0],
  preferredTime = '10:00 AM',
  location = 'General Location',
  preferredLanguage = 'English',
  consultationRequestId = 'REQ-PREVIEW-101',
}) => {
  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl space-y-6">
      
      {/* CARD HEADER */}
      <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
            Consultation Payment
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Appointment Request Summary
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Reference ID</span>
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {consultationRequestId}
          </span>
        </div>
      </div>

      {/* NON-SENSITIVE PATIENT & SCHEDULE DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
        
        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60">
          <User className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
            <span className="font-bold text-slate-900 truncate block">{patientName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60">
          <Video className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Type</span>
            <span className="font-bold text-slate-900 truncate block">{consultationTypeTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60">
          <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Appointment Date</span>
            <span className="font-bold text-slate-900 truncate block">{appointmentDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60">
          <Clock className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Preferred Time</span>
            <span className="font-bold text-slate-900 truncate block">{preferredTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60">
          <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
            <span className="font-bold text-slate-900 truncate block">{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/60">
          <Globe className="w-4 h-4 text-brand-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
            <span className="font-bold text-slate-900 truncate block">{preferredLanguage}</span>
          </div>
        </div>

      </div>

      {/* PRIVACY PROTECTED NOTICE */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
        <Lock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>Clinical reason provided & encrypted. Omitted from payment receipts for privacy.</span>
      </div>

      {/* FEE ITEMIZATION */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Consultation / Appointment Fee</span>
          <span className="font-medium text-slate-900">₹5.00</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Processing & Taxes</span>
          <span className="font-medium text-slate-900">₹0.00</span>
        </div>
        <div className="flex items-center justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-brand-600" /> Total Amount Payable
          </span>
          <span className="text-2xl font-black text-brand-700">₹5.00 INR</span>
        </div>
      </div>

    </Card>
  )
}
