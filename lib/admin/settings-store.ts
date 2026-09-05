import { PlatformSettings, PublicSettings } from '@/types/settings'
import { UserRole } from '@/types/auth'
import { logAuditEvent } from './audit-logger'

let currentSettings: PlatformSettings = {
  platformName: 'Global Doctor Telemedicine Platform',
  supportEmail: 'support@globaltelemed.org',
  supportPhone: '+91 1800 123 4567',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR',
  consultationFeeInINR: 5.0, // Fixed to ₹5.00 INR
  maintenanceMode: false,
  maintenanceMessage:
    'Platform under scheduled maintenance. Normal patient and doctor access is temporarily restricted.',
  doctorRegistrationEnabled: true,
  doctorVerificationRequired: true,
  patientRegistrationEnabled: true,
  guestInspectionEnabled: true,
  minPasswordLength: 8,
  sessionTimeoutMinutes: 1440,
  rateLimitRequestsPerMin: 60,
  updatedAt: new Date().toISOString(),
  updatedBy: 'USR-SA-001',
}

export function getPlatformSettings(): PlatformSettings {
  return { ...currentSettings }
}

export function getPublicSettings(): PublicSettings {
  return {
    platformName: currentSettings.platformName,
    supportEmail: currentSettings.supportEmail,
    supportPhone: currentSettings.supportPhone,
    maintenanceMode: currentSettings.maintenanceMode,
    maintenanceMessage: currentSettings.maintenanceMessage,
    guestInspectionEnabled: currentSettings.guestInspectionEnabled,
  }
}

export function isMaintenanceModeActive(): boolean {
  return currentSettings.maintenanceMode
}

export function updatePlatformSettings(
  newSettings: Partial<PlatformSettings>,
  actorUserId: string
): { success: boolean; settings?: PlatformSettings; error?: string } {
  const previousMaintenance = currentSettings.maintenanceMode

  // Enforce server-authoritative fixed rules
  const updated: PlatformSettings = {
    ...currentSettings,
    ...newSettings,
    currency: 'INR', // Strictly locked to INR
    consultationFeeInINR: 5.0, // Strictly locked to 5.00 INR
    updatedAt: new Date().toISOString(),
    updatedBy: actorUserId,
  }

  currentSettings = updated

  // Log specific maintenance audit events if maintenance status changed
  if (previousMaintenance !== updated.maintenanceMode) {
    logAuditEvent({
      actorUserId,
      actorRole: UserRole.SUPER_ADMIN,
      action: updated.maintenanceMode ? 'MAINTENANCE_ENABLED' : 'MAINTENANCE_DISABLED',
      targetType: 'SYSTEM',
      details: updated.maintenanceMode
        ? `Super Admin enabled platform maintenance mode: ${updated.maintenanceMessage}`
        : 'Super Admin disabled platform maintenance mode. Normal operations restored.',
      success: true,
    })
  }

  logAuditEvent({
    actorUserId,
    actorRole: UserRole.SUPER_ADMIN,
    action: 'PLATFORM_SETTING_CHANGED',
    targetType: 'SETTINGS',
    details: 'Super Admin updated global platform settings.',
    success: true,
  })

  return { success: true, settings: { ...currentSettings } }
}
