import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

/* =========================
   HELPER: OTP GENERATOR
========================= */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =========================
   REGISTER CONTROLLER
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, mobile_no } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password || !mobile_no) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // 5️⃣ Insert user
    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password, mobile_no, mobile_otp, otp_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email`,
      [name, email, hashedPassword, mobile_no, otp, otpExpiry]
    );

    // 🔔 DEMO PURPOSE ONLY
    console.log("📲 Mobile OTP (demo):", otp);

    res.status(201).json({
      message: "User registered successfully. OTP sent to mobile.",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({ error: "User registration failed" });
  }
};

/* =========================
   LOGIN CONTROLLER
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/* =========================
   SEND MOBILE OTP (AFTER LOGIN)
========================= */
export const sendMobileOTP = async (req, res) => {
  try {
    const userId = req.user.userId;

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET mobile_otp = $1, otp_expires_at = $2
       WHERE id = $3`,
      [otp, otpExpiry, userId]
    );

    console.log("📲 Mobile OTP (demo):", otp);

    res.json({ message: "OTP sent to registered mobile number" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* =========================
   VERIFY MOBILE OTP
========================= */
export const verifyMobileOTP = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otp } = req.body;

    const result = await pool.query(
      `SELECT mobile_otp, otp_expires_at
       FROM users WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];

    if (!user || user.mobile_otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await pool.query(
      `UPDATE users
       SET is_mobile_verified = true,
           mobile_otp = NULL,
           otp_expires_at = NULL
       WHERE id = $1`,
      [userId]
    );

    res.json({ message: "Mobile number verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};