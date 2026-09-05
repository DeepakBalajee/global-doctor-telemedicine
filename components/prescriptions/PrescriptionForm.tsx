'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, FileText, CheckCircle2, ShieldCheck } from 'lucide-react'
import { PrescriptionMedication } from '@/types/prescription'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createPrescription } from '@/lib/medical-records/medical-records-client'

export interface PrescriptionFormProps {
  appointmentId: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorSpecialty?: string
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  appointmentId,
  patientId,
  patientName,
  doctorId,
  doctorName,
  doctorSpecialty = 'Cardiology',
}) => {
  const router = useRouter()
  const [diagnosis, setDiagnosis] = useState('')
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [medications, setMedications] = useState<PrescriptionMedication[]>([
    {
      id: 'MED-01',
      medicineName: 'Metoprolol Succinate ER',
      dosage: '25 mg',
      frequency: 'Once Daily (1-0-0)',
      duration: '14 Days',
      instructions: 'Take after breakfast',
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        id: 'MED-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        medicineName: '',
        dosage: '',
        frequency: 'Twice Daily (1-0-1)',
        duration: '7 Days',
        instructions: '',
      },
    ])
  }

  const handleRemoveMedication = (id: string) => {
    if (medications.length <= 1) return
    setMedications(medications.filter((m) => m.id !== id))
  }

  const handleMedicationChange = (id: string, field: keyof PrescriptionMedication, value: string) => {
    setMedications(
      medications.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!diagnosis.trim()) {
      setError('Please provide a clinical diagnosis.')
      return
    }

    // Validate medication rows
    for (const med of medications) {
      if (!med.medicineName.trim() || !med.dosage.trim()) {
        setError('All medication rows must have a valid Medicine Name and Dosage.')
        return
      }
    }

    setError(null)
    setIsSubmitting(true)

    const payload = {
      appointmentId,
      patientId,
      patientName,
      doctorId,
      doctorName,
      doctorSpecialty,
      diagnosis: diagnosis.trim(),
      clinicalNotes: clinicalNotes.trim(),
      medications,
    }

    const res = await createPrescription(payload)

    if (res.success && res.prescription) {
      router.push(`/doctor/prescriptions/${res.prescription.id}`)
    } else {
      setError(res.error || 'Failed to issue prescription.')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200 bg-white rounded-2xl max-w-4xl mx-auto shadow-xl space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <FileText className="w-3.5 h-3.5 text-teal-600" /> Clinical Prescription Writer
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
            Issue Digital Prescription
          </h1>
          <p className="text-xs text-slate-500">
            Patient: <strong className="text-slate-900">{patientName}</strong> (ID: {patientId}) • Appointment #{appointmentId}
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* DIAGNOSIS & CLINICAL NOTES */}
        <div className="space-y-4">
          <Input
            label="Clinical Diagnosis *"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Sinus Tachycardia, Mild Hypertension"
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Clinical Advice & Notes</label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Additional medical advice, dietary recommendations, or follow-up instructions..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[90px]"
            />
          </div>
        </div>

        {/* MEDICATIONS TABLE / DYNAMIC ROWS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Prescribed Medications ({medications.length})
            </h3>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMedication}
              className="text-xs font-bold gap-1 text-teal-700 border-teal-200 hover:bg-teal-50"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medication
            </Button>
          </div>

          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={med.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Medicine #{index + 1}</span>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(med.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove Medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <Input
                    label="Medicine Name *"
                    value={med.medicineName}
                    onChange={(e) => handleMedicationChange(med.id, 'medicineName', e.target.value)}
                    placeholder="e.g. Paracetamol, Amoxicillin"
                    required
                  />

                  <Input
                    label="Dosage *"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(med.id, 'dosage', e.target.value)}
                    placeholder="e.g. 500 mg, 1 Tablet"
                    required
                  />

                  <Input
                    label="Frequency *"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(med.id, 'frequency', e.target.value)}
                    placeholder="e.g. Twice Daily (1-0-1)"
                    required
                  />

                  <Input
                    label="Duration *"
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(med.id, 'duration', e.target.value)}
                    placeholder="e.g. 5 Days, 1 Month"
                    required
                  />
                </div>

                <Input
                  label="Instructions (Optional)"
                  value={med.instructions || ''}
                  onChange={(e) => handleMedicationChange(med.id, 'instructions', e.target.value)}
                  placeholder="e.g. Take after meals with lukewarm water"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            type="submit"
            variant="teal"
            size="md"
            disabled={isSubmitting}
            className="font-bold text-xs gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Issuing Prescription...' : 'Issue Digital Prescription'}
          </Button>
        </div>

      </form>

    </Card>
  )
}
