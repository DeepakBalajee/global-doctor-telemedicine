import { SecurityRequirement } from '@/types/auth'

export const SECURITY_PRINCIPLES: SecurityRequirement[] = [
  {
    title: 'Encrypted Communication',
    description: 'All audio, video, and data in transit are protected using end-to-end TLS 1.3 and WebRTC encryption.',
    iconName: 'Shield',
  },
  {
    title: 'Secure Authentication',
    description: 'Multi-factor authentication (MFA), short-lived session tokens, and strict password security controls.',
    iconName: 'Key',
  },
  {
    title: 'Role-Based Access Control',
    description: 'Granular RBAC ensures patients, doctors, administrative staff, and Super Admin access only appropriate resources.',
    iconName: 'UserCheck',
  },
  {
    title: 'Protected Medical Documents',
    description: 'Clinical notes, prescriptions, and diagnostic media stored with AES-256 encryption at rest.',
    iconName: 'FileLock',
  },
  {
    title: 'Comprehensive Audit Logging',
    description: 'Immutable system audit logs capture security, administrative, and access events for operational traceability.',
    iconName: 'ClipboardList',
  },
  {
    title: 'Secure Payment Processing',
    description: 'Tokenized transaction handling through PCI-DSS Level 1 compliant gateway partners.',
    iconName: 'CreditCard',
  },
  {
    title: 'Controlled Administrative Access',
    description: 'Super Admin system isolation with hardware-bound MFA options and zero shared administrative credentials.',
    iconName: 'Lock',
  },
]
