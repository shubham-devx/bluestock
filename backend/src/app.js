import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// base routes
app.use("/", authRoutes);
app.use("/", companyRoutes);

export default app;

