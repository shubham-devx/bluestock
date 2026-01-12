import { pool } from "../config/db.js";

/* ================================
   CREATE COMPANY PROFILE
================================ */
export const createCompany = async (req, res) => {
  try {
    const { company_name, website, description } = req.body;

    // ✅ user id from JWT
    const userId = req.user.id || req.user.userId;

    // ❌ prevent duplicate company per user
    const existingCompany = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (existingCompany.rows.length > 0) {
      return res.status(400).json({
        error: "Company profile already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO company_profiles (user_id, company_name, website, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, company_name, website, description]
    );

    res.status(201).json({
      message: "Company profile created",
      company: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE COMPANY ERROR:", error);
    res.status(500).json({
      error: "Failed to create company profile",
    });
  }
};

/* ================================
   GET COMPANY PROFILE
================================ */
export const getCompany = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const result = await pool.query(
      "SELECT * FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Company profile not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET COMPANY ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch company profile",
    });
  }
};

/* ================================
   UPDATE COMPANY PROFILE
================================ */
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { company_name, website, description } = req.body;

    // check if company exists
    const existingCompany = await pool.query(
      "SELECT id FROM company_profiles WHERE user_id = $1",
      [userId]
    );

    if (existingCompany.rows.length === 0) {
      return res.status(404).json({
        error: "Company profile not found",
      });
    }

    const result = await pool.query(
      `UPDATE company_profiles
       SET company_name = $1,
           website = $2,
           description = $3
       WHERE user_id = $4
       RETURNING *`,
      [company_name, website, description, userId]
    );

    res.status(200).json({
      message: "Company profile updated successfully",
      company: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);
    res.status(500).json({
      error: "Failed to update company profile",
    });
  }
};
