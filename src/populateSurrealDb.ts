import Surreal from 'surrealdb.js'
import { Problem } from './Problem'

const ENV_SURREAL_HOST = 'SURREALDB_HOST'
const ENV_SURREAL_USER = 'SURREALDB_USER'
const ENV_SURREAL_PASS = 'SURREALDB_PASS'
const SURREALDB_HOST_DEFAULT = 'http://127.0.0.1:8000'
const PROBLEM_TABLENAME = 'problem'

const populateAux = async (db: Surreal, problems: Problem[]): Promise<void> => {
  console.log(`Logging in with env variables ${ENV_SURREAL_USER} and ${ENV_SURREAL_PASS}`)
  const user = process.env[ENV_SURREAL_USER] ?? ''
  const pass = process.env[ENV_SURREAL_PASS] ?? ''

  await db.signin({ user, pass })
  await db.use('kattis', 'kattis')

  for (const problem of problems) {
    await db.create(PROBLEM_TABLENAME, problem as any)
  }
}

export const populateSurrealDb = async (rows: Problem[]): Promise<void> => {
  const host = process.env[ENV_SURREAL_HOST] ?? SURREALDB_HOST_DEFAULT

  console.log(`Using host from env variable ${ENV_SURREAL_HOST} (defaults to ${SURREALDB_HOST_DEFAULT})`)
  console.log(`Connecting to SurrealDB ${host}`)

  const db = new Surreal(`${host}/rpc`)

  try {
    await populateAux(db, rows)
    db.close()
  } catch (e) {
    console.error('SurrealDB error found')
    throw e
  }
}
