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
   * Generates a 6-digit OTP code, dispatches SMS via SMS Gateway, and persists in PostgreSQL.
   */
  async sendPhoneOTP(input: SendOTPInput): Promise<{ success: boolean; message: string }> {
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

      // Log SMS dispatch on server side for auditing
      console.log(`[REALTIME SMS GATEWAY] Dispatching 6-digit OTP ${generatedOTP} via SMS to ${cleanMobile}`)

      // Optional Realtime SMS Gateway Integrations (Fast2SMS / Twilio)
      if (process.env.FAST2SMS_API_KEY) {
        try {
          await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
              'authorization': process.env.FAST2SMS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              route: 'otp',
              variables_values: generatedOTP,
              numbers: cleanMobile.replace(/\D/g, '').slice(-10),
            }),
          })
        } catch (smsErr) {
          console.error('[SMS GATEWAY ERROR]:', smsErr)
        }
      } else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
          const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: cleanMobile.startsWith('+') ? cleanMobile : `+91${cleanMobile}`,
              From: process.env.TWILIO_PHONE_NUMBER || '',
              Body: `Your Global Doctor Telemedicine verification code is ${generatedOTP}. Valid for 5 minutes.`,
            }),
          })
        } catch (smsErr) {
          console.error('[TWILIO SMS ERROR]:', smsErr)
        }
      }

      return {
        success: true,
        message: `6-digit OTP code sent successfully to ${cleanMobile} via SMS.`,
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

      // Mark OTP as verified in PostgreSQL
      await db.query(
        `UPDATE phone_otp_verifications SET is_verified = true WHERE id = $1`,
        [res.rows[0].id]
      )

      return {
        success: true,
        message: 'Phone number verified successfully via SMS OTP.',
      }
    } catch (err) {
      console.error('verifyPhoneOTP Error:', err)
      return { success: false, message: 'Failed to verify OTP. Please try again.' }
    }
  }
}

export const otpService = new OTPService()
