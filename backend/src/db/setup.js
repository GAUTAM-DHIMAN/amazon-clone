import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const schemaPath = path.join(__dirname, '../../db/schema.sql');
  const seedPath = path.join(__dirname, '../../db/seed.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const seed = fs.readFileSync(seedPath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schema);

    const { rows } = await client.query('SELECT COUNT(*)::int AS c FROM products');
    if (rows[0].c === 0) {
      await client.query(seed);
    }

    await client.query('COMMIT');
    console.log('Database schema ready. Seed applied if products table was empty.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
