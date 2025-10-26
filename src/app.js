import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

export default app;
