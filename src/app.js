import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import jobApplicationRoutes from "./routes/jobApplication.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/recruiter", recruiterRoutes);

export default app;
