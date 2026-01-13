// import dotenv from "dotenv";
// dotenv.config();
// import app from "./app.js";
// import { pool } from "./config/db.js";

// const PORT = 5000;

// const startServer = async () => {
//   try {
//     await pool.query("SELECT 1");
//     console.log("✅ PostgreSQL connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ DB connection failed:", err.message);
//   }
// };

// startServer();
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { pool } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
