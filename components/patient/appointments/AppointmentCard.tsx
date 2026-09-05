'use client'

import React from 'react'
import Link from 'next/link'
import { Stethoscope, Calendar, Clock, ArrowRight, XCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface AppointmentCardProps {
  appointment: PatientAppointmentDetail
  onCancelClick?: (appointment: PatientAppointmentDetail) => void
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancelClick,
}) => {
  const isUpcoming = appointment.appointmentStatus === 'CONFIRMED' || appointment.appointmentStatus === 'REQUESTED'
  const isCompleted = appointment.appointmentStatus === 'COMPLETED'
  const isCancelled = appointment.appointmentStatus === 'CANCELLED'

  return (
    <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-4 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* DOCTOR & APPOINTMENT OVERVIEW */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100 font-bold">
            <Stethoscope className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">{appointment.doctorName}</span>
              
              {/* STATUS BADGES */}
              {isUpcoming && (
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                  CONFIRMED
                </span>
              )}
              {isCompleted && (
                <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md">
                  COMPLETED
                </span>
              )}
              {isCancelled && (
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded-md">
                  CANCELLED
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-teal-700">
              {appointment.doctorType === 'SPECIALIST' ? `Specialist (${appointment.specialtyName})` : 'General Physician'}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-3 pt-0.5">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {appointment.appointmentDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {appointment.startTime}
              </span>
            </p>
          </div>
        </div>

        {/* FEE & ACTIONS */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Fee: ₹{appointment.feeInINR}.00 ({appointment.paymentStatus})
          </span>

          <div className="flex items-center gap-2">
            {isUpcoming && appointment.isCancellable && onCancelClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelClick(appointment)}
                className="text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-200"
              >
                Cancel
              </Button>
            )}

            <Link href={`/patient/appointments/${appointment.id}`}>
              <Button variant="teal" size="sm" className="text-xs font-semibold gap-1">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </Card>
  )
}
