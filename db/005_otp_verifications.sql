CREATE TABLE IF NOT EXISTS phone_otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'PATIENT',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_mobile ON phone_otp_verifications(mobile_number);
