import { NavItem, FooterColumn } from '@/types/navigation'

export const HEADER_NAV_ITEMS: NavItem[] = [
  { label: 'Find Doctors', href: '/patient/doctors' },
  { label: 'Book Consultation', href: '/consultation-request' },
  { label: 'Patient Portal', href: '/patient/login' },
  { label: 'For Doctors', href: '/doctor/register' },
]

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Doctors', href: '/patient/doctors' },
      { label: 'Book Consultation', href: '/consultation-request' },
      { label: 'Patient Register', href: '/patient/register' },
      { label: 'Doctor Join', href: '/doctor/register' },
    ],
  },
  {
    title: 'User Portals',
    links: [
      { label: 'Patient Login', href: '/patient/login' },
      { label: 'Patient Dashboard', href: '/patient/dashboard' },
      { label: 'Doctor Login', href: '/doctor/login' },
      { label: 'Doctor Workstation', href: '/doctor/dashboard' },
    ],
  },
  {
    title: 'Administration',
    links: [
      { label: 'Super Admin Console', href: '/super-admin/login' },
      { label: 'System Health', href: '/api/health/readiness' },
    ],
  },
]
