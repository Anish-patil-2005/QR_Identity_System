import pool from "../config/db.js";

export const getPublicProfile = async (req, res) => {
  const { slug } = req.params;

  try {
    // 1️⃣ Find user by slug
    const userResult = await pool.query(
      "SELECT user_id, role FROM users WHERE public_slug = $1 AND is_active = true",
      [slug]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { user_id, role } = userResult.rows[0];

    // 2️⃣ Based on role fetch profile
    if (role === "faculty") {
      const facultyResult = await pool.query(
        `SELECT 
            employee_id,
            name,
            designation,
            department,
            email,
            phone,
            linkedin,
            whatsapp,
            website,
            google_scholar,
            profile_photo_url,
            research,
            created_at
         FROM faculty
         WHERE user_id = $1`,
        [user_id]
      );

      if (facultyResult.rows.length === 0) {
        return res.status(404).json({ message: "Faculty profile not found" });
      }

      return res.json({
        role: "faculty",
        profile: facultyResult.rows[0]
      });
    }

    // Future: student handling
    return res.status(400).json({ message: "Unsupported role" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching public profile" });
  }
};
