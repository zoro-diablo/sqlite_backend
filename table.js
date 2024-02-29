const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./user.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
  if (err) return console.error(err.message);
});

// Define the SQL query to create a new table for the user model
const sql = `CREATE TABLE IF NOT EXISTS user(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  role TEXT,
  team TEXT,
  status TEXT,
  avatar TEXT
)`;

// Execute the SQL query to create the table
db.run(sql, (err) => {
  if (err) return console.error(err.message);
  console.log("Table created successfully");
});
