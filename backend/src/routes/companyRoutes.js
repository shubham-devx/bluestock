import express from "express";
import {
  createCompany,
  getCompany,
  updateCompany
} from "../controllers/companyController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* COMPANY ROUTES */
router.post("/company/profile", authenticateToken, createCompany);
router.get("/company/profile", authenticateToken, getCompany);
router.put("/company/profile", authenticateToken, updateCompany);


export default router;
