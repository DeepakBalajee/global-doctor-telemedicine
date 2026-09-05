export interface AppEnvConfig {
  isProduction: boolean
  nodeEnv: string
  appUrl: string
  apiBaseUrl: string
  databaseUrl: string
  jwtSecret: string
  razorpayKeyId: string
  razorpaySecret: string
  videoServiceKey: string
  videoSignalingUrl: string
}

export function getEnvConfig(): AppEnvConfig {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    isProduction,
    nodeEnv: process.env.NODE_ENV || 'development',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://telemed_user:secret@localhost:5432/telemed_db',
    jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_key_32_characters_min',
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
    videoServiceKey: process.env.VIDEO_SERVICE_API_KEY || 'video_key_placeholder',
    videoSignalingUrl: process.env.NEXT_PUBLIC_VIDEO_SIGNALING_URL || 'wss://localhost:3000/signal',
  }
}

export function validateProductionEnv(): { valid: boolean; missingVariables: string[] } {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'RAZORPAY_KEY_SECRET',
    'VIDEO_SERVICE_API_KEY',
  ]

  const missing: string[] = []
  if (process.env.NODE_ENV === 'production') {
    required.forEach((v) => {
      if (!process.env[v]) {
        missing.push(v)
      }
    })
  }

  return {
    valid: missing.length === 0,
    missingVariables: missing,
  }
}
