
// TABLES

const taskstbl = `
CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      due_by DATETIME,
      instructor TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`;

const coursestbl = `
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`;

const usertbl = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      acctype TEXT NOT NULL CHECK (acctype IN ('STUDENT', 'FACILITATOR', 'TEACHER')) DEFAULT 'STUDENT',
      fees INTEGER DEFAULT 0
);`

const announcementstbl = `
CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`;

export { usertbl, coursestbl, taskstbl, announcementstbl };