import express from "express";
import cors from "cors";

// Routes
import adminroutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import facultyRoutes from "./routes/faculty.routes.js"
import publicRoutes from "./routes/public.routes.js";


// Middleware
// import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/* -------------------- GLOBAL MIDDLEWARE -------------------- */

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

/* -------------------- HEALTH CHECK -------------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "QR Identity System Backend Running 🚀"
  });
});

/* -------------------- ROUTES -------------------- */

app.use("/api/admin", adminroutes);

app.use("/api/auth", authRoutes);

app.use("/api/faculty", facultyRoutes)

app.use("/", publicRoutes);

/* -------------------- ERROR HANDLER -------------------- */

// app.use(errorHandler);

export default app;
