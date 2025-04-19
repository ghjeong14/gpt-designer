// 📦 Day 6 – Connect Your Backend to a Database
// Goal: Save chat history in a real database (not just localStorage)

// Step 1: Install SQLite (or another DB)
// For simplicity, we’ll use SQLite with better-sqlite3
// Run this in terminal:
// npm install better-sqlite3

// Step 2: Create a db.js file to manage database logic

const Database = require('better-sqlite3');
const db = new Database('./chat.db');

// Create table if it doesn’t exist
const init = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      reply TEXT NOT NULL,
      role TEXT,
      model TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
};

const saveMessage = (prompt, reply, role, model) => {
  const stmt = db.prepare('INSERT INTO messages (prompt, reply, role, model) VALUES (?, ?, ?, ?)');
  stmt.run(prompt, reply, role, model);
  console.log("💾 Message saved to DB");
};

const getMessages = () => {
  return db.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50').all();
};

function getAllMessages() {
    const stmt = db.prepare("SELECT * FROM messages ORDER BY timestamp ASC");
    return stmt.all();
}

module.exports = {
  init,
  saveMessage,
  getMessages,
  getAllMessages
};
