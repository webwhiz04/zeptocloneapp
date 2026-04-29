import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import userDataRoutes from "./routes/userdata.js";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";

import config from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = [
  clientOrigin,
  "http://127.0.0.1:5173",
  "https://zeptoclone.vercel.app",
  "https://zeptoclone-git-main-preethampoojary443s-projects.vercel.app",
  "https://workspace-nine-iota.vercel.app"
];

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = config.PORT || 5000;

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed)) || 
                        origin.endsWith(".vercel.app"); // Allow all vercel deployments
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/userdata", userDataRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  return res.status(200).json({ message: "Backend is running" });
});

app.use((req, res) => {
  return res
    .status(404)
    .json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  return res.status(status).json({
    message,
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
