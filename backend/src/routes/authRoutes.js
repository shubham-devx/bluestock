import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { pool } from "../config/db.js";

const router = express.Router();

/* AUTH ROUTES */
router.post("/register", register);
router.post("/login", login);

/* PROTECTED ROUTE */
router.get("/profile", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [req.user.id]
  );
  res.json(result.rows[0]);
});

export default router;
