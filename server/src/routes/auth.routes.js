import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { login } from "../controllers/auth.controller.js";
import { changePassword } from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/login", login);
router.put("/change-password", authenticate, changePassword);


export default router;
