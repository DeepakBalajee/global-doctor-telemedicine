export type PrescriptionStatus = 'DRAFT' | 'ISSUED' | 'REVOKED' | 'ARCHIVED'

export interface PrescriptionMedication {
  id: string
  medicineName: string
  dosage: string // e.g. "500 mg"
  frequency: string // e.g. "Twice Daily (1-0-1)"
  duration: string // e.g. "5 Days"
  instructions?: string // e.g. "Take after food"
}

export interface Prescription {
  id: string
  appointmentId: string
  consultationSessionId?: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorSpecialty?: string
  diagnosis: string
  clinicalNotes?: string
  status: PrescriptionStatus
  medications: PrescriptionMedication[]
  issuedAt?: string
  createdAt: string
  updatedAt: string
}
