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

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('DATABASE TABLES:')
    result.rows.forEach(row => console.log(row.table_name))
  } catch (error) {
    console.error('DATABASE CHECK FAILED')
    console.error(error.message)
  } finally {
    await client.end()
  }
}

main()
