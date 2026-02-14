import express from "express";
import { getPublicProfile } from "../controllers/public.controller.js";

const router = express.Router();

// Public QR route
router.get("/u/:slug", getPublicProfile);

export default router;
