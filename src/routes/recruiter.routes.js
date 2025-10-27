import express from "express";
import { getRecruiterDashboard } from "../controllers/recruiter.controller.js";
import { verifyToken } from "../middlewares/middleware.js";

const router = express.Router();

router.get("/board", verifyToken, getRecruiterDashboard);

export default router;
