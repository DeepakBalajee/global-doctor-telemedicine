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

    const result = await client.query(
      "SELECT tc.table_name, tc.constraint_type, tc.constraint_name FROM information_schema.table_constraints tc WHERE tc.table_schema = 'public' ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name"
    )

    console.log('DATABASE CONSTRAINTS:')

    for (const row of result.rows) {
      console.log(
        row.table_name +
        ' | ' +
        row.constraint_type +
        ' | ' +
        row.constraint_name
      )
    }
  } catch (error) {
    console.error('CONSTRAINT CHECK FAILED')
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main()