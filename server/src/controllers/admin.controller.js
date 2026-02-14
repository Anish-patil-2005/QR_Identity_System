import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateQRCode } from "../utils/qr.js";
export const createFaculty = async (req, res) => {
  const { name, email, employee_id } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Validation: Check existing Email
    const existingUser = await client.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2️⃣ Validation: Check existing Employee ID
    const existingFaculty = await client.query("SELECT 1 FROM faculty WHERE employee_id = $1", [employee_id]);
    if (existingFaculty.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // 3️⃣ Preparations
    const initialPassword = employee_id;
    const hashedPassword = await bcrypt.hash(initialPassword, 10);
    const publicSlug = `faculty-${employee_id}`;

    // 4️⃣ Generate QR Data BEFORE inserting (so we can save it)
    const qrData = await generateQRCode(publicSlug); 

    // 5️⃣ Insert into users table (INCLUDING the qr_code string)
    const userResult = await client.query(
      `INSERT INTO users (email, password, role, public_slug, qr_code)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id`,
      [email, hashedPassword, "faculty", publicSlug, qrData.qr] // qrData.qr is the base64 string
    );

    const user_id = userResult.rows[0].user_id;

    // 6️⃣ Insert into faculty table
    await client.query(
      `INSERT INTO faculty (employee_id, name, email, user_id)
       VALUES ($1, $2, $3, $4)`,
      [employee_id, name, email, user_id]
    );

    await client.query("COMMIT");

    // Success response
    res.status(201).json({
      message: "Faculty created successfully",
      initial_password: initialPassword,
      public_slug: publicSlug,
      qr_code: qrData.qr // Returning the string so the Admin UI can show it immediately
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction Error:", error);
    res.status(500).json({ message: "Error creating faculty" });
  } finally {
    client.release();
  }
};
