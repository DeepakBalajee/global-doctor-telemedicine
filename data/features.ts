import { Feature } from '@/types/feature'

export const PATIENT_FEATURES_DATA: Feature[] = [
  {
    id: 'smart-queue',
    title: 'Smart Queue System',
    description: 'Know your real-time queue position and estimated waiting time before your turn.',
    iconName: 'Clock',
    tag: 'Real-time',
  },
  {
    id: 'secure-consultation',
    title: 'Secure Consultation Room',
    description: 'Join high-quality browser-based audio and video calls with zero software installation required.',
    iconName: 'Video',
    tag: 'Browser-based',
  },
  {
    id: 'digital-prescriptions',
    title: 'Digital Prescriptions',
    description: 'Receive verified digital prescriptions immediately following your telemedicine appointment.',
    iconName: 'FileText',
    tag: 'Instant Access',
  },
  {
    id: 'medical-documents',
    title: 'Medical Documents Vault',
    description: 'Keep your clinical notes, diagnostic reports, and medical history organized in one secure place.',
    iconName: 'FolderLock',
    tag: 'Encrypted',
  },
  {
    id: 'appointment-management',
    title: 'Appointment Management',
    description: 'Schedule, reschedule, or review upcoming and historical doctor appointments effortlessly.',
    iconName: 'Calendar',
    tag: 'Flexible',
  },
  {
    id: 'instant-notifications',
    title: 'Instant Notifications',
    description: 'Receive critical appointment alerts, doctor status updates, and queue reminders via SMS & email.',
    iconName: 'Bell',
    tag: 'Automated',
  },
]
