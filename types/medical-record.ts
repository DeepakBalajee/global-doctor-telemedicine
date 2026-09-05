import { Prescription } from './prescription'

export type MedicalDocumentType = 'LAB_REPORT' | 'IMAGING' | 'PAST_PRESCRIPTION' | 'GENERAL'

export interface MedicalDocument {
  id: string
  patientId: string
  patientName?: string
  uploadedBy: 'PATIENT' | 'DOCTOR'
  doctorId?: string
  appointmentId?: string
  documentType: MedicalDocumentType
  fileName: string
  storageKey: string
  mimeType: string
  fileSize: number
  status: 'ACTIVE' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface MedicalRecordSummary {
  patientId: string
  patientName: string
  prescriptions: Prescription[]
  documents: MedicalDocument[]
  completedConsultationsCount: number
}
