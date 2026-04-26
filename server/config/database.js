import './dotenv.js'
import pg from 'pg'

const requiredEnvVars = ['PGUSER', 'PGPASSWORD', 'PGHOST', 'PGPORT', 'PGDATABASE']
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Missing Postgres env vars: ${missingEnvVars.join(', ')}`)
}

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false
    },
    family: 4
}

export const pool = new pg.Pool(config)