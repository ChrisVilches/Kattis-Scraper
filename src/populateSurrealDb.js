import Surreal from 'surrealdb.js'

const ENV_SURREAL_HOST = 'SURREALDB_HOST'
const ENV_SURREAL_USER = 'SURREALDB_USER'
const ENV_SURREAL_PASS = 'SURREALDB_PASS'

const SURREALDB_HOST_DEFAULT = 'http://127.0.0.1:8000'

const populateAux = async (db, rows) => {
  console.log(`Logging in with env variables ${ENV_SURREAL_USER} and ${ENV_SURREAL_PASS}`)
  const user = process.env[ENV_SURREAL_USER]
  const pass = process.env[ENV_SURREAL_PASS]

  await db.signin({ user, pass })
  await db.use('kattis', 'kattis')

  for (const row of rows) {
    await db.create('problem', row)
  }
}

export const populateSurrealDb = async rows => {
  const host = process.env[ENV_SURREAL_HOST] || SURREALDB_HOST_DEFAULT

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
