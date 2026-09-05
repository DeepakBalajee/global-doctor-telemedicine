import { TrustIndicator } from '@/types/trust'

export const TRUST_INDICATORS_DATA: TrustIndicator[] = [
  {
    id: 'verified-doctors',
    title: 'Verified Doctors',
    description: 'Rigorously credentials-checked and board-certified medical professionals.',
    iconName: 'BadgeCheck',
  },
  {
    id: 'secure-consultations',
    title: 'Secure Consultations',
    description: 'Browser-based end-to-end encrypted audio and video consultations.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'protected-records',
    title: 'Protected Records',
    description: 'Encrypted storage for medical history, prescriptions, and test results.',
    iconName: 'Lock',
  },
  {
    id: 'trusted-payments',
    title: 'Trusted Payments',
    description: 'PCI-compliant payment processing with transparent pricing structure.',
    iconName: 'CreditCard',
  },
]
