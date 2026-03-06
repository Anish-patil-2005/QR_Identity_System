import { bulkSyncFaculty, createFaculty } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import multer from 'multer';
import { Router } from "express";

const router = Router ();

router.get(
  "/admin-only",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);



// Only admin can create faculty
router.post(
  "/create-faculty",
  authenticate,
  authorize("admin"),
  createFaculty
);




// Configure Multer to store files temporarily in an 'uploads' folder
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        // Validation: Only allow CSV files
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

// Route definition
router.post('/bulk-sync', upload.single('file'), bulkSyncFaculty);




export default router;


