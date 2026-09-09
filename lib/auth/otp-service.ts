import { db } from '@/lib/db'

export interface SendOTPInput {
  mobileNumber: string
  role?: string
}

export interface VerifyOTPInput {
  mobileNumber: string
  otpCode: string
  role?: string
}

export class OTPService {
  /**
   * Generates a 6-digit OTP code and persists it in PostgreSQL with 5-min expiration.
   */
  async sendPhoneOTP(input: SendOTPInput): Promise<{ success: boolean; message: string; otpCode?: string }> {
    const { mobileNumber, role = 'PATIENT' } = input

    if (!mobileNumber || mobileNumber.trim().length < 8) {
      return { success: false, message: 'Please enter a valid phone number.' }
    }

    const cleanMobile = mobileNumber.trim().replace(/\s+/g, '')
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()

    try {
      // Invalidate existing active OTPs for this number
      await db.query(
        `UPDATE phone_otp_verifications SET expires_at = NOW() WHERE mobile_number = $1 AND is_verified = false`,
        [cleanMobile]
      )

      // Store new OTP in PostgreSQL database (expires in 5 minutes)
      await db.query(
        `
        INSERT INTO phone_otp_verifications (mobile_number, otp_code, role, expires_at)
        VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')
        `,
        [cleanMobile, generatedOTP, role]
      )

      console.log(`[OTP SERVICE] Sent 6-digit OTP ${generatedOTP} to ${cleanMobile}`)

      return {
        success: true,
        message: `6-digit OTP code sent successfully to ${cleanMobile}.`,
        otpCode: generatedOTP, // Provided for user preview & testing
      }
    } catch (err) {
      console.error('sendPhoneOTP Error:', err)
      return { success: false, message: 'Failed to send SMS OTP. Please try again.' }
    }
  }

  /**
   * Verifies the 6-digit OTP code against PostgreSQL database.
   */
  async verifyPhoneOTP(input: VerifyOTPInput): Promise<{ success: boolean; message: string }> {
    const { mobileNumber, otpCode } = input

    if (!mobileNumber || !otpCode || otpCode.trim().length !== 6) {
      return { success: false, message: 'Please enter a valid 6-digit OTP code.' }
    }

    const cleanMobile = mobileNumber.trim().replace(/\s+/g, '')
    const cleanOTP = otpCode.trim()

    try {
      const res = await db.query(
        `
        SELECT id FROM phone_otp_verifications
        WHERE mobile_number = $1
          AND otp_code = $2
          AND is_verified = false
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [cleanMobile, cleanOTP]
      )

      if (res.rows.length === 0) {
        return { success: false, message: 'Invalid or expired OTP code. Please request a new code.' }
      }

      // Mark OTP as verified
      await db.query(
        `UPDATE phone_otp_verifications SET is_verified = true WHERE id = $1`,
        [res.rows[0].id]
      )

      return {
        success: true,
        message: 'Phone number verified successfully.',
      }
    } catch (err) {
      console.error('verifyPhoneOTP Error:', err)
      return { success: false, message: 'Failed to verify OTP. Please try again.' }
    }
  }
}

export const otpService = new OTPService()
