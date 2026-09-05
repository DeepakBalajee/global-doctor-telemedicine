import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured')
}

export const db = new Pool({
  connectionString,
  max: Number(process.env.DATABASE_POOL_MAX || 20),
  min: Number(process.env.DATABASE_POOL_MIN || 2),
  ssl: false,
})
