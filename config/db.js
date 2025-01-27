// Importing sqlite3 and path modules
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
/* -------------------------------- Constants ------------------------------- */

// This is messy, I'm aware.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDirectory = path.resolve(__dirname, '../db');
const dbPath = path.join(dbDirectory, 'database.db');

/* -------------------------------- Database -------------------------------- */

// Create the SQLite database.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite:', err.message);
    throw err;
  }
  console.log('Connected to the SQLite database.');
});

export default db;
