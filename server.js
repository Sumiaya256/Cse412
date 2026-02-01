const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const http = require("http");
const socketio = require("socket.io");

const Employee = require("../models/Employee"); // correct path

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// ===== DATABASE =====
mongoose.connect("mongodb://127.0.0.1:27017/ispSystem")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ===== FILE UPLOAD CONFIG =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ================= ROUTES =================

// Login Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Employee Dashboard
app.get("/employee", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// ================= API =================

// Save employee info
app.post("/saveProfile", async (req, res) => {
  const { name, email, phone } = req.body;

  const emp = await Employee.findOneAndUpdate(
    { email },
    { name, phone },
    { upsert: true, new: true }
  );

  res.json({ message: "Profile saved to database!" });
});

// Upload photo
app.post("/uploadPhoto", upload.single("photo"), async (req, res) => {
  const photoPath = "/uploads/" + req.file.filename;

  await Employee.findOneAndUpdate({}, { photo: photoPath });

  res.json({ photo: photoPath });
});

// Notifications
app.get("/notifications", (req, res) => {
  const msgs = ["New task assigned", "Salary credited", "System update done"];
  res.json({ notification: msgs[Math.floor(Math.random() * msgs.length)] });
});

// ================= REALTIME CHAT =================
io.on("connection", socket => {
  console.log("User Connected");

  socket.on("chatMessage", msg => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => console.log("User Disconnected"));
});

// ================= START =================
server.listen(3000, () => console.log("Server running at http://localhost:3000"));
