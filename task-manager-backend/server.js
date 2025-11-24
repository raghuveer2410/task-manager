import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./Routes/auth.js";
import taskRoutes from "./Routes/tasks.js";

dotenv.config();
const app = express();

// -------------------- CORS CONFIG --------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://task-manager-cyan-chi.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// -------------------- ROUTES --------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("🚀 Task Manager Backend is Live!");
});

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// -------------------- DATABASE CONNECTION --------------------
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Stop app if DB fails
  }
};

startServer();
