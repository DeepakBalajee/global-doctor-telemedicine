const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd())

const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false
})

async function main() {
  try {
    await client.connect()

    await client.query(
      'ALTER TABLE patients ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(30)'
    )

    console.log('PATIENT MOBILE COLUMN VERIFIED')
  } catch (error) {
    console.error('SCHEMA UPDATE FAILED')
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main()