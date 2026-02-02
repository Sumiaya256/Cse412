const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database", "isp.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // ===== USERS =====
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, name TEXT, email TEXT, status TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO users VALUES('U001','Alice Smith','alice@example.com','Active')`);
  db.run(`INSERT OR IGNORE INTO users VALUES('U002','Bob Johnson','bob@example.com','Inactive')`);
  db.run(`INSERT OR IGNORE INTO users VALUES('U003','Charlie Brown','charlie@example.com','Inactive')`);

  // ===== EMPLOYEES =====
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY, name TEXT, position TEXT, status TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO employees VALUES('E001','John Doe','Technician','Active')`);
  db.run(`INSERT OR IGNORE INTO employees VALUES('E002','Mary Jane','Manager','Active')`);
  db.run(`INSERT OR IGNORE INTO employees VALUES('E003','Mike Ross','Support','Active')`);

  // ===== REVENUE =====
  db.run(`CREATE TABLE IF NOT EXISTS revenue (
    month TEXT PRIMARY KEY, amount INTEGER
  )`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Jan',12000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Feb',15000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Mar',14000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Apr',18000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('May',20000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Jun',22000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Jul',21000)`);
  db.run(`INSERT OR IGNORE INTO revenue VALUES('Aug',24000)`);

  // ===== ISSUES =====
  db.run(`CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, status TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO issues (description,status) VALUES('ONU offline detected','pending')`);
  db.run(`INSERT OR IGNORE INTO issues (description,status) VALUES('Payment not received','pending')`);
  db.run(`INSERT OR IGNORE INTO issues (description,status) VALUES('Customer complaint unresolved','resolved')`);

});

db.close(() => console.log("Database seeded successfully!"));
