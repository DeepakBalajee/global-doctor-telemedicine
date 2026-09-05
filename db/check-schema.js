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
      "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position"
    )

    let currentTable = ''

    console.log('DATABASE SCHEMA:')

    for (const row of result.rows) {
      if (row.table_name !== currentTable) {
        currentTable = row.table_name
        console.log('\n[' + currentTable + ']')
      }

      console.log(' ' + row.column_name + ' : ' + row.data_type)
    }
  } catch (error) {
    console.error('SCHEMA CHECK FAILED')
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main()