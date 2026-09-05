'use client'

import React from 'react'
import { PhoneOff, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface EndConsultationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirmEnd: () => void
}

export const EndConsultationDialog: React.FC<EndConsultationDialogProps> = ({
  isOpen,
  onClose,
  onConfirmEnd,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <Card className="p-6 max-w-md w-full bg-white border-slate-200 rounded-2xl space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="text-base font-extrabold text-slate-900">
            End Consultation Session?
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to conclude this consultation? Ending the session will mark the appointment status as completed.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onConfirmEnd}
            className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5" /> End Consultation Now
          </Button>
        </div>
      </Card>
    </div>
  )
}
