import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS MUST come before routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Body parser MUST come before routes
app.use(express.json());

// routes
app.use("/", authRoutes);
app.use("/", companyRoutes);

export default app;


