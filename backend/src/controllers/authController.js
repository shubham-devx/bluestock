import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

/* =========================
   REGISTER CONTROLLER
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
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

    // 4️⃣ Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    // 5️⃣ Success response
    res.status(201).json({
      message: "User registered successfully",
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

    // ✅ FIX HERE
    const token = jwt.sign(
  {
    userId: user.id,     // 🔑 REQUIRED
    email: user.email
  },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: "1h" }
);


    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
