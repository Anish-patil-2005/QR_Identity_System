import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pool from "../src/config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const email = "admin@qr-system.com";
    const plainPassword = "Admin@123"; // Change later

    // Check if admin already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      console.log("⚠ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await pool.query(
      `INSERT INTO users (email, password, role, is_first_login)
       VALUES ($1, $2, $3, $4)`,
      [email, hashedPassword, "admin", false]
    );

    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", plainPassword);

  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    process.exit();
  }
};

createAdmin();
