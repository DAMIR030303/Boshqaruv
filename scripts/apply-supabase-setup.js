// Run: node scripts/apply-supabase-setup.js "<POSTGRES_URL_NON_POOLING>"
import { Client } from 'pg'
import fs from 'fs'

async function main() {
  const conn = process.argv[2] || process.env.POSTGRES_URL_NON_POOLING
  if (!conn) {
    console.error('Missing Postgres connection string')
    process.exit(1)
  }
  const sql = fs.readFileSync('supabase/setup.sql', 'utf8')
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    await client.query(sql)
    console.log('Supabase tables, Realtime and RLS configured successfully.')
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


