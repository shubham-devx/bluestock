import express from "express";
import {
  register,
  login,
  sendMobileOTP,
  verifyMobileOTP,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { pool } from "../config/db.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// 🔐 Send mobile OTP (JWT protected)
router.post("/send-otp", authenticateToken, sendMobileOTP);

// 🔐 Verify mobile OTP (JWT protected)
router.post("/verify-otp", authenticateToken, verifyMobileOTP);

/* =========================
   PROTECTED ROUTE
========================= */

// Get logged-in user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        full_name,
        email,
        mobile_no,
        is_email_verified,
        is_mobile_verified
       FROM users
       WHERE id = $1`,
      [req.user.userId] // ✅ from JWT payload
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

export default router;