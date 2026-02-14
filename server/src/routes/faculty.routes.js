import express from "express";
import { getMyProfile, updateFacultyProfile } from "../controllers/faculty.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Faculty can update only their own profile
router.put(
  "/update-profile",
  authenticate,
  authorize("faculty"),
  updateFacultyProfile
);

router.get(
  "/me",
  authenticate,
  authorize("faculty"),
  getMyProfile
)

export default router;
