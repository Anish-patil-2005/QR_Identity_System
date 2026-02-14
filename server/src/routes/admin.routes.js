import { createFaculty } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
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



export default router;
