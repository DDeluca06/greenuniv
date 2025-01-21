const taskstbl = `
CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      due_by DATETIME,
      instructor 
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
      acctype TEXT NOT NULL CHECK (acctype IN ('STUDENT', 'FACILITATOR', 'TEACHER')) DEFAULT 'STUDENT'
    )
`;


export { usertbl, coursestbl, taskstbl };