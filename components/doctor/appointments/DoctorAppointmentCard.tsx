'use client'

import React from 'react'
import Link from 'next/link'
import { User, Calendar, Clock, ArrowRight, CheckCircle2, Video, PhoneCall, ShieldCheck } from 'lucide-react'
import { PatientAppointmentDetail } from '@/types/patient-appointment'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface DoctorAppointmentCardProps {
  appointment: PatientAppointmentDetail
  onConfirmClick?: (appointment: PatientAppointmentDetail) => void
  onCompleteClick?: (appointment: PatientAppointmentDetail) => void
  onCancelClick?: (appointment: PatientAppointmentDetail) => void
}

export const DoctorAppointmentCard: React.FC<DoctorAppointmentCardProps> = ({
  appointment,
  onConfirmClick,
  onCompleteClick,
  onCancelClick,
}) => {
  const isUpcoming = appointment.appointmentStatus === 'CONFIRMED' || appointment.appointmentStatus === 'REQUESTED'
  const isCompleted = appointment.appointmentStatus === 'COMPLETED'
  const isCancelled = appointment.appointmentStatus === 'CANCELLED'

  return (
    <Card className="p-5 border-slate-200 bg-white rounded-2xl space-y-4 hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* PATIENT & APPOINTMENT OVERVIEW */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">{appointment.patientName}</span>
              
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

            <p className="text-xs text-slate-600">
              Mode: <strong>{appointment.consultationType}</strong> • Fee: <strong className="text-emerald-700">₹{appointment.feeInINR}.00 ({appointment.paymentStatus})</strong>
            </p>

            <p className="text-xs text-slate-500 flex items-center gap-3 pt-0.5">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {appointment.appointmentDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {appointment.startTime}
              </span>
            </p>

            <p className="text-xs text-slate-500 italic line-clamp-1 pt-1">
              Concern: {appointment.problem}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          
          {isUpcoming && onCompleteClick && (
            <Button
              variant="teal"
              size="sm"
              onClick={() => onCompleteClick(appointment)}
              className="text-xs font-semibold"
            >
              Mark Complete
            </Button>
          )}

          {isUpcoming && onCancelClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelClick(appointment)}
              className="text-xs font-semibold text-red-600 hover:bg-red-50 border-red-200"
            >
              Cancel
            </Button>
          )}

          <Link href={`/doctor/appointments/${appointment.id}`}>
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

        </div>

      </div>
    </Card>
  )
}
