import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect DB first
pool.query("SELECT NOW()")
  .then((res) => {
    console.log("✅ DB Connected at:", res.rows[0].now);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
