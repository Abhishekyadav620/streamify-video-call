import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001; // ✅ CHANGED: Added a default port in case PORT is missing on Render.

app.use(
  cors({
    // ✅ CHANGED: Added the deployed frontend URL later.
    // For now localhost is enough. After Vercel deployment,
    // replace/add your Vercel URL here.
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
       "https://streamify-video-call.netlify.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ✅ CHANGED: Added a health-check route.
// This lets you verify that the backend is running by visiting:
// https://your-render-url.onrender.com/
app.get("/", (req, res) => {
  res.send("🚀 Streamify Backend is Running...");
});

// ❌ REMOVED:
// --------------------------------------------
// import path from "path";
// const __dirname = path.resolve();
//
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }
// --------------------------------------------
//
// WHY?
// You are deploying:
//
// Frontend  ---> Vercel
// Backend   ---> Render
//
// Therefore the backend DOES NOT contain frontend/dist.
// Those lines are only needed when frontend and backend
// are hosted together on the same server.
//
// They were also causing this Render error:
//
// PathError: Missing parameter name at index 1: *
// because Express v5 doesn't support app.get("*") the
// same way Express v4 did.

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});