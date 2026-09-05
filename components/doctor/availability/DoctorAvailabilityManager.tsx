'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  PlusCircle,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Ban,
  Stethoscope,
} from 'lucide-react'
import {
  WeeklyAvailabilitySlot,
  DayOfWeek,
  SlotDuration,
  DoctorAvailabilityConfig,
} from '@/types/availability'
import { ConsultationType } from '@/types/patient'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  getDoctorAvailability,
  saveWeeklyAvailability,
  addBlockedDate,
} from '@/lib/doctor/doctor-availability-client'

export const DoctorAvailabilityManager: React.FC = () => {
  const [slots, setSlots] = useState<WeeklyAvailabilitySlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Blocked date form state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [vacationReason, setVacationReason] = useState('')

  useEffect(() => {
    async function loadSchedule() {
      setIsLoading(true)
      const config = await getDoctorAvailability()
      if (config) {
        setSlots(config.weeklySlots)
      }
      setIsLoading(false)
    }
    loadSchedule()
  }, [])

  const handleSlotToggle = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s))
    )
  }

  const handleTimeChange = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const handleDurationChange = (id: string, duration: SlotDuration) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, slotDuration: duration } : s))
    )
  }

  const handleSaveSchedule = async () => {
    setMessage(null)
    setIsSaving(true)

    const result = await saveWeeklyAvailability(slots)
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Schedule updated successfully.' })
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to update schedule.' })
    }

    setIsSaving(false)
  }

  const handleAddVacationBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    const res = await addBlockedDate({ startDate, endDate, reason: vacationReason })
    if (res.success) {
      setMessage({ type: 'success', text: 'Vacation blocked range saved.' })
      setStartDate('')
      setEndDate('')
      setVacationReason('')
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to block dates.' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading doctor availability schedule...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <Clock className="w-3.5 h-3.5 text-teal-600" /> Availability & Slot Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Configure Consultation Schedule
          </h1>
          <p className="text-xs text-slate-500">
            Set your weekly working hours, appointment slot durations, lunch breaks, and vacation leave dates.
          </p>
        </div>

        <Button
          variant="teal"
          size="md"
          disabled={isSaving}
          onClick={handleSaveSchedule}
          className="font-bold gap-2 shadow-md shadow-teal-600/20"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving Schedule...' : 'Save Weekly Schedule'}
        </Button>
      </div>

      {/* MESSAGE BANNER */}
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* WEEKLY SCHEDULE CARDS */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" /> Recurring Weekly Working Hours
        </h3>

        <div className="space-y-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all ${
                slot.isAvailable
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* DAY TOGGLE */}
                <div className="flex items-center gap-3 w-40">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slot.isAvailable}
                      onChange={() => handleSlotToggle(slot.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                  </label>
                  <span className="text-xs font-extrabold text-slate-900 uppercase">
                    {slot.day}
                  </span>
                </div>

                {/* WORKING HOURS INPUTS */}
                {slot.isAvailable ? (
                  <div className="flex flex-wrap items-center gap-3 flex-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-semibold">From:</span>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleTimeChange(slot.id, 'startTime', e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-semibold">To:</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleTimeChange(slot.id, 'endTime', e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* DURATION SELECT */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-semibold">Slot:</span>
                      <select
                        value={slot.slotDuration}
                        onChange={(e) => handleDurationChange(slot.id, Number(e.target.value) as SlotDuration)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold text-xs focus:outline-none focus:border-teal-500"
                      >
                        <option value={15}>15 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>60 mins</option>
                      </select>
                    </div>

                    {/* BREAK DISPLAY */}
                    {slot.break && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                        Break: {slot.break.startTime} – {slot.break.endTime}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-semibold italic">
                    Unavailable / Day Off
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* VACATION / BLOCKED DATES CARD */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Ban className="w-4 h-4 text-red-600" /> Vacation & Blocked Leave Ranges
        </h3>

        <form onSubmit={handleAddVacationBlock} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Input
            label="Start Date *"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date *"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <Input
            label="Reason (Optional)"
            placeholder="e.g. Annual Medical Conference"
            value={vacationReason}
            onChange={(e) => setVacationReason(e.target.value)}
          />

          <div className="sm:col-span-3 flex justify-end">
            <Button type="submit" variant="secondary" size="md" className="font-semibold text-xs gap-1.5">
              <PlusCircle className="w-4 h-4 text-slate-600" /> Add Blocked Range
            </Button>
          </div>
        </form>
      </Card>

    </div>
  )
}
