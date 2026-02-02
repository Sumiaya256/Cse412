const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// SQLite DB
const db = new sqlite3.Database(path.join(__dirname, "database", "isp.db"));

// ===== API =====

// Users
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Employees
app.get("/api/employees", (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Revenue
app.get("/api/revenue", (req, res) => {
  db.all("SELECT * FROM revenue", [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Pending Issues
app.get("/api/issues", (req, res) => {
  db.all("SELECT * FROM issues WHERE status='pending'", [], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Notifications (fake)
app.get("/api/notifications", (req,res) => {
  const msgs = ["New customer registered","Payment received","ONU offline detected"];
  const msg = msgs[Math.floor(Math.random()*msgs.length)];
  res.json({ message: msg });
});

// Socket.io chat
io.on("connection", socket => {
  console.log("User connected");
  socket.on("chatMessage", msg => io.emit("chatMessage", msg));
  socket.on("disconnect", () => console.log("User disconnected"));
});

// Start server
server.listen(3000, () => console.log("Server running at http://localhost:3000"));

