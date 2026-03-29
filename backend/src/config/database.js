import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString || String(connectionString).trim() === '') {
  console.warn(
    'Warning: DATABASE_URL is not set. Set it in backend/.env (see .env.example).'
  );
}

/**
 * Shared connection pool (use for single statements and read-only work).
 * @see https://node-postgres.com/apis/pool
 */
export const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_MAX) || 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool client error', err);
});

/**
 * Run a parameterized query. Prefer this over string concatenation to prevent SQL injection.
 * @param {string} text SQL with $1, $2, … placeholders
 * @param {unknown[]} [params] values bound to placeholders
 * @returns {Promise<import('pg').QueryResult>}
 */
export function query(text, params) {
  return pool.query(text, params);
}

/**
 * Execute work inside a transaction. Rolls back automatically on throw.
 * @param {(client: import('pg').PoolClient) => Promise<T>} fn
 * @returns {Promise<T>}
 * @template T
 */
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Rollback failed', rollbackErr);
    }
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Lightweight DB connectivity check for health endpoints.
 * @returns {Promise<boolean>}
 */
export async function checkDatabase() {
  try {
    const { rows } = await pool.query('SELECT 1 AS ok');
    return rows[0]?.ok === 1;
  } catch {
    return false;
  }
}
