import pool from "../config/db.js";

export const updateFacultyProfile = async (req, res) => {
  const {
    designation,
    phone,
    linkedin,
    whatsapp,
    website,
    google_scholar,
    profile_photo_url,
    research // This is the array of papers
  } = req.body;

  try {
    const userEmail = req.user.email;

    // --- FIX STARTS HERE ---
    // We must stringify the array so Postgres receives a valid JSON string
    // We also handle the case where research might be undefined
    const researchData = research ? JSON.stringify(research) : null;
    // --- FIX ENDS HERE ---

    const result = await pool.query(
      `UPDATE faculty 
       SET designation = COALESCE($1, designation),
           phone = COALESCE($2, phone),
           linkedin = COALESCE($3, linkedin),
           whatsapp = COALESCE($4, whatsapp),
           website = COALESCE($5, website),
           google_scholar = COALESCE($6, google_scholar),
           profile_photo_url = COALESCE($7, profile_photo_url),
           research = COALESCE($8, research)
       WHERE email = $9
       RETURNING *`,
      [
        designation,
        phone,
        linkedin,
        whatsapp,
        website,
        google_scholar,
        profile_photo_url,
        researchData, // Using the stringified version
        userEmail
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json({
      message: "Profile updated successfully",
      faculty: result.rows[0]
    });

  } catch (error) {
    console.error("Database Update Error:", error);
    res.status(500).json({ message: "Error updating profile", details: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    // Assuming req.user is populated by your authenticate middleware
    const userEmail = req.user.email; 

    const query = `
      SELECT 
        f.name,
        f.email,
        f.employee_id,
        f.designation,
        f.department,
        f.phone,
        f.linkedin,
        f.whatsapp,
        f.website,
        f.google_scholar,
        f.profile_photo_url,
        f.research,
        u.qr_code,
        u.public_slug
      FROM faculty f
      JOIN users u ON f.email = u.email
      WHERE f.email = $1
    `;

    const result = await pool.query(query, [userEmail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};