import sqlite3 from 'sqlite3';

// Open or create a SQLite database file
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to add a user
function addUser(username, email, password, acctype = 'STUDENT') {
  const insertUser = `
  INSERT INTO users (username, email, password, acctype)
  VALUES (?, ?, ?, ?)
  `;
  db.run(insertUser, [username, email, password, acctype], function (err) {
    if (err) {
      console.error('Error adding user:', err.message);
    } else {
      console.log(`User added with ID: ${this.lastID}`);
    }
  });
}

// Example usage: Add a new user
addUser('John Smith', 'user@univ.com', 'password', 'STUDENT');

// Close the database connection
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
