import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateQRCode } from "../utils/qr.js";
import fs from 'fs';
import csv from 'csv-parser';

export const createFaculty = async (req, res) => {
  const { name, email, employee_id, designation, department } = req.body;
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
      `INSERT INTO faculty (employee_id, name, email, user_id, designation,department)
       VALUES ($1, $2, $3, $4, $5,$6)`,
      [employee_id, name, email, user_id,designation,department]
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


export const bulkSyncFaculty = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file uploaded" });
  }

  const filePath = req.file.path;
  const facultyRows = [];
  const summary = { total: 0, success: 0, failed: 0, errors: [] };

  try {
    // 1. Stream the CSV into an array
    const parseCSV = new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => facultyRows.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    await parseCSV;
    summary.total = facultyRows.length;

    const client = await pool.connect();

    // 2. Process each row using your specific logic
    for (const row of facultyRows) {
      const { name, email, employee_id, designation, department } = row;

      try {
        await client.query("BEGIN");

        // Step 1: Check existing Email
        const existingUser = await client.query("SELECT 1 FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) throw new Error("Email already exists");

        // Step 2: Check existing Employee ID
        const existingFaculty = await client.query("SELECT 1 FROM faculty WHERE employee_id = $1", [employee_id]);
        if (existingFaculty.rows.length > 0) throw new Error("Employee ID already exists");

        // Step 3: Preparations
        const initialPassword = employee_id; // Using ID as password per your logic
        const hashedPassword = await bcrypt.hash(initialPassword, 10);
        const publicSlug = `faculty-${employee_id}`;

        // Step 4: Generate QR
        const qrData = await generateQRCode(publicSlug);

        // Step 5: Insert into Users
        const userResult = await client.query(
          `INSERT INTO users (email, password, role, public_slug, qr_code)
           VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
          [email, hashedPassword, "faculty", publicSlug, qrData.qr]
        );

        const user_id = userResult.rows[0].user_id;

        // Step 6: Insert into Faculty
        await client.query(
          `INSERT INTO faculty (employee_id, name, email, user_id, designation, department)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [employee_id, name, email, user_id, designation, department]
        );

        await client.query("COMMIT");
        summary.success++;
      } catch (innerError) {
        await client.query("ROLLBACK");
        summary.failed++;
        summary.errors.push({ 
          employee_id: employee_id || "Unknown", 
          error: innerError.message 
        });
      }
    }

    client.release();
    fs.unlinkSync(filePath); // Always clean up the temp file

    // Return 207 Multi-Status
    res.status(207).json({
      message: "Bulk synchronization completed",
      summary
    });

  } catch (outerError) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Catastrophic Sync Error:", outerError);
    res.status(500).json({ message: "System failed to process the file." });
  }
};