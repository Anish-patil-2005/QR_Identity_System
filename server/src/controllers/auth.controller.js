import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   


    // 1️⃣ Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const user = result.rows[0];

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT
    const token = generateToken({
    user_id: user.user_id,
    role: user.role,
    email: user.email
});


    res.json({
      message: "Login successful",
      token,
      role: user.role,
      is_first_login: user.is_first_login
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user.user_id;

    // 1️⃣ Get current user
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 2️⃣ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update password + remove first login flag
    await pool.query(
      `UPDATE users
       SET password = $1,
           is_first_login = false
       WHERE user_id = $2`,
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
};
